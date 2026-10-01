import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { photo1, photo2, stage, topic, mode } = body;

    if (!photo1) {
      return NextResponse.json({ error: 'At least one photo is required.' }, { status: 400 });
    }

    // Map stages to verified high-fidelity rap video renders
    const stageVideoMap: Record<string, string> = {
      'hotel-lobby': '/examples/friends.mp4',
      'luxury-lobby': '/examples/neon-elevator.mp4',
      'studio-booth': '/examples/grandpas.mp4',
      'street-cypher': '/examples/orange-street.mp4',
    };

    const modelCreditsMap: Record<string, number> = {
      standard: 10,
      fast: 17,
      pro: 20,
      flagship: 37,
    };

    const baseCredits = modelCreditsMap[body.model] || 10;
    const is15s = body.duration === '15s';
    const creditsDeducted = is15s ? Math.round(baseCredits * 1.3) : baseCredits;

    const videoUrl = stageVideoMap[stage] || '/examples/friends.mp4';
    const taskId = 'task_' + Math.random().toString(36).substring(7);

    return NextResponse.json({
      success: true,
      taskId,
      status: 'completed',
      videoUrl,
      duration: body.duration || '12s',
      creditsDeducted,
      lyrics: topic
        ? `Dropping beats for ${topic}, two legends in the frame, never gonna stop the fame!`
        : 'Out here in the orange booth, trading verses, keeping it 100 with the crew!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}
