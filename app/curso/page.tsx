import { getModules, ModuleInfo, LessonInfo } from '../../lib/course';
import CourseIndexClient, { LightModule } from '../../components/CourseIndexClient';

export default function CursoIndexPage() {
  const modules = getModules();
  const light: LightModule[] = modules.map((m: ModuleInfo) => ({
    name: m.name,
    lessons: m.lessons.map((l: LessonInfo) => ({ slug: l.slug, title: l.title, module: m.name }))
  }));

  return (
    <main className="container mx-auto p-6">
      {modules.length === 0 ? (
        <p className="text-gray-600">Nenhum conteúdo encontrado. Verifique a pasta <code>docs/course</code>.</p>
      ) : (
        <CourseIndexClient modules={light} />
      )}
    </main>
  );
}
