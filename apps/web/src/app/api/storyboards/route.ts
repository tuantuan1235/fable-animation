import { NextRequest, NextResponse } from 'next/server';
import { runMigrations, createStoryboard, getStoryboard, listStoryboards } from '@fable/db';
import { createEmptyStoryboard } from '@fable/shared';

// GET /api/storyboards - 列出所有剧本
export async function GET() {
  try {
    await runMigrations();
    const list = await listStoryboards();
    return NextResponse.json({ ok: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// POST /api/storyboards - 创建新剧本
export async function POST(request: NextRequest) {
  try {
    await runMigrations();
    const body = await request.json();
    const storyboard = createEmptyStoryboard();

    if (body.title) storyboard.title = body.title;
    if (body.targetDurationSeconds) storyboard.targetDurationSeconds = body.targetDurationSeconds;
    if (body.aspectRatio) storyboard.aspectRatio = body.aspectRatio;
    if (body.ttsVoice) storyboard.ttsVoice = body.ttsVoice;

    await createStoryboard({
      id: storyboard.id,
      title: storyboard.title,
      description: storyboard.description,
      targetDurationSeconds: storyboard.targetDurationSeconds,
      ttsVoice: storyboard.ttsVoice,
      aspectRatio: storyboard.aspectRatio,
    });

    return NextResponse.json({ ok: true, data: storyboard }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
