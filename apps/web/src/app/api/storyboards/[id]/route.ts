import { NextRequest, NextResponse } from 'next/server';
import { runMigrations, getStoryboard, updateStoryboard, deleteStoryboard, saveAllScenes } from '@fable/db';
import type { Storyboard } from '@fable/shared';

// GET /api/storyboards/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await runMigrations();
    const storyboard = await getStoryboard(params.id);
    if (!storyboard) {
      return NextResponse.json({ ok: false, error: '未找到' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: storyboard });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/storyboards/[id] - 保存整个剧本
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await runMigrations();
    const body: Storyboard = await request.json();

    await updateStoryboard(params.id, {
      title: body.title,
      description: body.description,
      targetDurationSeconds: body.targetDurationSeconds,
      ttsVoice: body.ttsVoice,
      aspectRatio: body.aspectRatio,
    });

    await saveAllScenes(params.id, body.scenes);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/storyboards/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await runMigrations();
    await deleteStoryboard(params.id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
