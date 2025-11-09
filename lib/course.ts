import fs from 'fs';
import path from 'path';

export interface LessonInfo {
  module: string;
  slug: string; // e.g. 01-variaveis-e-tipos
  title: string; // extracted from first line
  filePath: string;
}

export interface ModuleInfo {
  name: string; // fundamentals
  lessons: LessonInfo[];
}

const COURSE_ROOT = path.join(process.cwd(), 'docs', 'course');

function readFirstLine(p: string): string {
  const content = fs.readFileSync(p, 'utf-8');
  const first = content.split(/\r?\n/)[0];
  return first.replace(/^#\s*/, '').trim();
}

export function getModules(): ModuleInfo[] {
  if (!fs.existsSync(COURSE_ROOT)) return [];
  const moduleDirs = fs.readdirSync(COURSE_ROOT).filter(d => fs.statSync(path.join(COURSE_ROOT, d)).isDirectory());
  return moduleDirs.map(md => {
    const dir = path.join(COURSE_ROOT, md);
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    const lessons: LessonInfo[] = files.map(f => {
      const fp = path.join(dir, f);
      const title = readFirstLine(fp);
      const slug = f.replace(/\.md$/, '');
      return { module: md, slug, title, filePath: fp };
    }).sort((a,b) => a.slug.localeCompare(b.slug));
    return { name: md, lessons };
  }).sort((a,b) => a.name.localeCompare(b.name));
}

export function getLesson(module: string, slug: string): LessonInfo | null {
  const file = path.join(COURSE_ROOT, module, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const title = readFirstLine(file);
  return { module, slug, title, filePath: file };
}

export function readLessonMarkdown(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}
