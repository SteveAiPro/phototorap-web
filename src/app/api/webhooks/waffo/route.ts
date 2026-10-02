import { NextResponse } from 'next/server';
import { verifyWebhook, WebhookEventType } from '@waffo/pancake-ts';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { addCredits } from '@/lib/credits';

export async function POST(req: Request) {
  try {
    // 关键规则：必须读取 raw text，JSON 解析会破坏 RSA-SHA256 签名校验
    const rawBody = await req.text();
    const signature = req.headers.get('x-waffo-signature') || req.headers.get('X-Waffo-Signature');

    if (!signature) {
      console.warn('[webhooks/waffo] Missing x-waffo-signature header');
      return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
    }

    let event: any;
    try {
      // 优先自动检验；若失败则显式指定 test 模式尝试
      try {
        event = verifyWebhook(rawBody, signature);
      } catch (firstErr) {
        event = verifyWebhook(rawBody, signature, { environment: 'test' });
      }
    } catch (err: any) {
      console.error('[webhooks/waffo] Signature verification failed:', err?.message, 'sig:', signature);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 幂等性去重：使用 event.id
    const deliveryId = event.id || event.eventId;
    const admin = getSupabaseAdmin();

    if (admin && deliveryId) {
      const { data: existingTx } = await admin
        .from('credit_transactions')
        .select('id')
        .eq('ref_id', deliveryId)
        .maybeSingle();

      if (existingTx) {
        console.log(`[webhooks/waffo] Delivery ${deliveryId} already processed, skipping.`);
        return new Response('OK', { status: 200 });
      }
    }

    // 处理订单完成或订阅开通
    if (
      event.eventType === WebhookEventType.OrderCompleted ||
      event.eventType === 'order.completed' ||
      event.eventType === WebhookEventType.SubscriptionActivated ||
      event.eventType === 'subscription.activated'
    ) {
      // 官方 Pancake Webhook 事件中，元数据存放在 event.data.orderMetadata
      const metadata =
        event.data?.orderMetadata ||
        event.data?.metadata ||
        event.metadata ||
        {};

      let userId = metadata.userId || event.data?.userId;
      const credits = Number(metadata.credits || 10);
      const buyerEmail = event.data?.buyerEmail;

      // 如果未携带 userId，尝试通过买家邮箱在数据库中查找对应用户
      if (!userId && buyerEmail && admin) {
        const { data: foundUser } = await admin
          .from('users')
          .select('id')
          .eq('email', buyerEmail)
          .maybeSingle();
        if (foundUser) {
          userId = foundUser.id;
        }
      }

      if (userId && credits > 0) {
        console.log(`[webhooks/waffo] Fulfilling ${credits} credits to user ${userId}`);
        await addCredits(
          userId,
          credits,
          'purchase',
          deliveryId,
          `Purchased ${event.data?.productName || 'Waffo Credit Plan'} (${event.data?.orderId || deliveryId})`
        );
      } else {
        console.warn(`[webhooks/waffo] Warning: Order completed but could not match user! userId: ${userId}, email: ${buyerEmail}`);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (err: any) {
    console.error('[webhooks/waffo] Webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
