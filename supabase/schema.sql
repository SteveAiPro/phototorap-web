-- =====================================================
-- PhotoToRap AI (phototorap.com) Database Schema
-- 适用于 Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. 用户表 (绑定 Supabase Auth)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar text,
  credits integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. 积分流水表 (充值、消费、新用户赠送、退还)
create table if not exists public.credit_transactions (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  amount integer not null, -- 正数=增加(充值/注册赠送)，负数=消耗
  type text not null check (type in ('signup', 'daily', 'purchase', 'generation', 'refund')),
  description text,
  ref_id text, -- 关联 Stripe Checkout session 或任务 ID
  created_at timestamptz not null default now()
);
create index if not exists idx_credit_tx_user on public.credit_transactions(user_id, created_at desc);

-- 3. AI 视频生成任务记录
create table if not exists public.video_generations (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  stage text not null default 'hotel_lobby', -- hotel_lobby | neon_cypher | subway
  audio_beat text,
  lyrics_topic text,
  status text not null default 'completed' check (status in ('pending', 'processing', 'completed', 'failed')),
  video_url text,
  cost_credits integer not null default 10,
  created_at timestamptz not null default now()
);
create index if not exists idx_video_gen_user on public.video_generations(user_id, created_at desc);

-- 4. 原子扣减积分函数 (并发安全，防止余额变负)
create or replace function public.deduct_credits(p_user_id uuid, p_amount integer, p_desc text default 'AI Rap Video Generation')
returns integer
language plpgsql
security definer
as $$
declare
  v_new_credits integer;
begin
  update public.users
  set credits = credits - p_amount,
      updated_at = now()
  where id = p_user_id and credits >= p_amount
  returning credits into v_new_credits;

  if v_new_credits is null then
    raise exception 'Insufficient credits';
  end if;

  insert into public.credit_transactions (user_id, amount, type, description)
  values (p_user_id, -p_amount, 'generation', p_desc);

  return v_new_credits;
end;
$$;

-- 5. 新注册用户自动创建 Profile 并免费发放 10 积分
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.users (id, email, name, avatar, credits)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    10
  )
  on conflict (id) do nothing;

  insert into public.credit_transactions (user_id, amount, type, description)
  values (new.id, 10, 'signup', 'Welcome bonus: 10 free credits');

  return new;
end;
$$;

-- 触发器：auth.users 注册后执行
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================
-- RLS 安全策略 (Row Level Security)
-- =====================================================
alter table public.users enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.video_generations enable row level security;

-- 用户只能读取或更新自己的信息
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users for select using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- 积分流水只能看自己的
drop policy if exists "tx_select_own" on public.credit_transactions;
create policy "tx_select_own" on public.credit_transactions for select using (auth.uid() = user_id);

-- 生成记录只能看自己的
drop policy if exists "videos_select_own" on public.video_generations;
create policy "videos_select_own" on public.video_generations for select using (auth.uid() = user_id);
