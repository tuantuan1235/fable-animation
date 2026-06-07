import { getDb, saveDb } from './connection';

export async function runMigrations(): Promise<void> {
  const db = await getDb();

  db.run(`
    CREATE TABLE IF NOT EXISTS storyboards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '未命名剧本',
      description TEXT DEFAULT '',
      target_duration_seconds REAL NOT NULL DEFAULT 30,
      tts_voice TEXT NOT NULL DEFAULT 'default',
      aspect_ratio TEXT NOT NULL DEFAULT '9:16',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS scenes (
      id TEXT PRIMARY KEY,
      storyboard_id TEXT NOT NULL,
      scene_order INTEGER NOT NULL DEFAULT 0,
      narration TEXT DEFAULT '',
      duration_seconds REAL NOT NULL DEFAULT 3,
      characters_json TEXT DEFAULT '[]',
      background_json TEXT DEFAULT '{}',
      subtitle_style_json TEXT,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (storyboard_id) REFERENCES storyboards(id) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_scenes_storyboard ON scenes(storyboard_id, scene_order);
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS render_tasks (
      id TEXT PRIMARY KEY,
      storyboard_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      progress REAL NOT NULL DEFAULT 0,
      output_url TEXT,
      error TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      FOREIGN KEY (storyboard_id) REFERENCES storyboards(id) ON DELETE CASCADE
    );
  `);

  saveDb();
  console.log('数据库迁移完成');
}
