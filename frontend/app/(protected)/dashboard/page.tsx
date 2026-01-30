import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SessionExpired from '@/components/SessionExpired';

interface TaskSummary {
  total_completed: number,
  total_pending: number,
  by_tag: Record<string, number>
}

async function getDashboardData(token: string): Promise<TaskSummary | null | 'EXPIRED'>{
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if(response.status == 401) return 'EXPIRED'

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error cargando dashboard:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const summary = await getDashboardData(session?.user.accessToken as string);

  if (summary === "EXPIRED") {
    return <SessionExpired />
  }

  return (
    <div className='max-w-5xl mx-auto'>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Resumen de Actividad</h1>
      
      {!summary ? (
        <div className="p-4 bg-yellow-900/50 border border-yellow-700 rounded text-yellow-200">
          No hay datos disponibles. ¿Ya creaste tareas?
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg transform transition hover:scale-105">
            <h3 className="text-gray-400 text-sm uppercase font-semibold">Completadas</h3>
            <p className="text-4xl font-bold text-green-400 mt-2">{summary.total_completed}</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg transform transition hover:scale-105">
            <h3 className="text-gray-400 text-sm uppercase font-semibold">Pendientes</h3>
            <p className="text-4xl font-bold text-yellow-400 mt-2">{summary.total_pending}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg sm:col-span-2 lg:col-span-1">
            <h3 className="text-gray-400 text-sm uppercase font-semibold">Etiquetas asignadas por tareas</h3>
            <ul className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600">
              {Object.entries(summary.by_tag).map(([tag, count]) => (
                <li key={tag} className="flex justify-between text-sm p-2 bg-gray-900/50 rounded hover:bg-gray-700/50 transition">
                  <span className="text-blue-300 font-medium">#{tag}</span>
                  <span className="text-white font-bold bg-gray-700 px-2 py-0.5 rounded-full text-xs">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}