import { NextRequest, NextResponse } from 'next/server';
import { validateStoryboard } from '@fable/shared';

// POST /api/validate - 校验剧本
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = validateStoryboard(body);
    return NextResponse.json({ ok: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
