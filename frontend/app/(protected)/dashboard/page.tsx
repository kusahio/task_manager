import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { taskService, SESSION_EXPIRED } from '@/services/task';
import { TaskSummary } from '@/types/task';
import SessionExpired from '@/components/SessionExpired';

function SummaryCard({ title, value, color, icon, subtitle }: Readonly<{
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  subtitle?: string;
}>) {
  return (
    <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700/60 shadow-lg backdrop-blur-sm hover:border-gray-600 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-gray-400 text-xs uppercase font-semibold tracking-wider">{title}</h3>
          <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-gray-700/50 group-hover:scale-110 transition-transform duration-300 ${color.replace('text-', 'text-').replace('400', '500/20')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function TagDistribution({ byTag }: Readonly<{ byTag: Record<string, number> }>) {
  const entries = Object.entries(byTag);
  return (
    <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700/60 shadow-lg backdrop-blur-sm sm:col-span-2 lg:col-span-1">
      <h3 className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Etiquetas asignadas
      </h3>
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg className="w-10 h-10 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          </svg>
          <p className="text-gray-500 text-sm">Ninguna tarea tiene etiquetas</p>
        </div>
      ) : (
        <ul className="space-y-2 max-h-44 overflow-y-auto pr-2 scrollbar-thin">
          {entries.map(([tag, count]) => (
            <li key={tag} className="flex justify-between items-center text-sm p-2.5 bg-gray-900/40 rounded-lg hover:bg-gray-700/40 transition-colors">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-blue-300 font-medium">#{tag}</span>
              </span>
              <span className="text-white font-bold bg-gray-700/60 px-2.5 py-0.5 rounded-full text-xs tabular-nums">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const summary: TaskSummary | null | typeof SESSION_EXPIRED = await taskService.getSummaryWithToken(session?.user.accessToken as string);

  if (summary === SESSION_EXPIRED) return <SessionExpired />;

  return (
    <div className='max-w-5xl mx-auto animate-fade-in'>
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">Resumen de Actividad</h1>
      </div>

      {summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <SummaryCard
            title="Completadas"
            value={summary.total_completed}
            color="text-green-400"
            icon={
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            subtitle={summary.total_completed > 0 ? `${Math.round(summary.total_completed / (summary.total_completed + summary.total_pending) * 100)}% del total` : undefined}
          />
          <SummaryCard
            title="Pendientes"
            value={summary.total_pending}
            color="text-yellow-400"
            icon={
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <TagDistribution byTag={summary.by_tag} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-800/30 rounded-xl border border-dashed border-gray-700/60 text-center">
          <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg text-gray-500 font-medium">No hay datos disponibles</p>
          <p className="text-gray-600 text-sm mt-1">¿Ya creaste tareas? Usa el panel de IA para empezar</p>
        </div>
      )}
    </div>
  );
}
