import { getDb, saveDb } from './connection';
import type { Storyboard, Scene, RenderTask } from '@fable/shared';

// ============ Storyboard CRUD ============

export async function listStoryboards(): Promise<Omit<Storyboard, 'scenes'>[]> {
  const db = await getDb();
  const result = db.exec(`
    SELECT id, title, description, target_duration_seconds, tts_voice, aspect_ratio, created_at, updated_at
    FROM storyboards ORDER BY updated_at DESC
  `);

  if (!result.length) return [];

  return result[0].values.map((row) => ({
    id: row[0] as string,
    title: row[1] as string,
    description: row[2] as string,
    targetDurationSeconds: row[3] as number,
    ttsVoice: row[4] as string,
    aspectRatio: row[5] as '9:16' | '16:9',
    createdAt: row[6] as string,
    updatedAt: row[7] as string,
  }));
}

export async function getStoryboard(id: string): Promise<Storyboard | null> {
  const db = await getDb();

  const rowResult = db.exec('SELECT * FROM storyboards WHERE id = ?', [id]);
  if (!rowResult.length || !rowResult[0].values.length) return null;

  const row = rowResult[0].values[0];
  const scenesResult = db.exec(
    'SELECT * FROM scenes WHERE storyboard_id = ? ORDER BY scene_order',
    [id]
  );

  const scenes: Scene[] = scenesResult.length
    ? scenesResult[0].values.map((r) => ({
        id: r[0] as string,
        order: r[2] as number,
        narration: r[3] as string,
        durationSeconds: r[4] as number,
        characters: JSON.parse((r[5] as string) || '[]'),
        background: JSON.parse((r[6] as string) || '{}'),
        subtitleStyle: r[7] ? JSON.parse(r[7] as string) : undefined,
        notes: (r[8] as string) || undefined,
      }))
    : [];

  return {
    id: row[0] as string,
    title: row[1] as string,
    description: row[2] as string,
    targetDurationSeconds: row[3] as number,
    ttsVoice: row[4] as string,
    aspectRatio: row[5] as '9:16' | '16:9',
    createdAt: row[6] as string,
    updatedAt: row[7] as string,
    scenes,
  };
}

export async function createStoryboard(data: {
  id: string;
  title: string;
  description?: string;
  targetDurationSeconds: number;
  ttsVoice?: string;
  aspectRatio?: '9:16' | '16:9';
}): Promise<string> {
  const db = await getDb();
  db.run(
    `INSERT INTO storyboards (id, title, description, target_duration_seconds, tts_voice, aspect_ratio)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.id, data.title, data.description || '', data.targetDurationSeconds, data.ttsVoice || 'default', data.aspectRatio || '9:16']
  );
  saveDb();
  return data.id;
}

export async function updateStoryboard(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    targetDurationSeconds: number;
    ttsVoice: string;
    aspectRatio: '9:16' | '16:9';
  }>
): Promise<void> {
  const db = await getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
  if (data.targetDurationSeconds !== undefined) { fields.push('target_duration_seconds = ?'); values.push(data.targetDurationSeconds); }
  if (data.ttsVoice !== undefined) { fields.push('tts_voice = ?'); values.push(data.ttsVoice); }
  if (data.aspectRatio !== undefined) { fields.push('aspect_ratio = ?'); values.push(data.aspectRatio); }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.run(`UPDATE storyboards SET ${fields.join(', ')} WHERE id = ?`, values);
  saveDb();
}

export async function deleteStoryboard(id: string): Promise<void> {
  const db = await getDb();
  db.run('DELETE FROM scenes WHERE storyboard_id = ?', [id]);
  db.run('DELETE FROM storyboards WHERE id = ?', [id]);
  saveDb();
}

// ============ Scene CRUD ============

export async function saveAllScenes(storyboardId: string, scenes: Scene[]): Promise<void> {
  const db = await getDb();
  db.run('DELETE FROM scenes WHERE storyboard_id = ?', [storyboardId]);

  const stmt = db.prepare(`
    INSERT INTO scenes (id, storyboard_id, scene_order, narration, duration_seconds, characters_json, background_json, subtitle_style_json, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const scene of scenes) {
    stmt.bind([
      scene.id,
      storyboardId,
      scene.order,
      scene.narration,
      scene.durationSeconds,
      JSON.stringify(scene.characters),
      JSON.stringify(scene.background),
      scene.subtitleStyle ? JSON.stringify(scene.subtitleStyle) : null,
      scene.notes || null,
    ]);
    stmt.step();
    stmt.reset();
  }

  stmt.free();
  saveDb();
}

// ============ RenderTask ============

export async function createRenderTask(task: RenderTask): Promise<void> {
  const db = await getDb();
  db.run(
    `INSERT INTO render_tasks (id, storyboard_id, status, progress, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [task.id, task.storyboardId, task.status, task.progress, task.createdAt]
  );
  saveDb();
}

export async function updateRenderTask(id: string, data: Partial<RenderTask>): Promise<void> {
  const db = await getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
  if (data.progress !== undefined) { fields.push('progress = ?'); values.push(data.progress); }
  if (data.outputUrl !== undefined) { fields.push('output_url = ?'); values.push(data.outputUrl); }
  if (data.error !== undefined) { fields.push('error = ?'); values.push(data.error); }
  if (data.completedAt !== undefined) { fields.push('completed_at = ?'); values.push(data.completedAt); }

  if (fields.length === 0) return;
  values.push(id);

  db.run(`UPDATE render_tasks SET ${fields.join(', ')} WHERE id = ?`, values);
  saveDb();
}
