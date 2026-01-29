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
    <div>
      <h1 className="text-3xl font-bold mb-6">Resumen de Actividad</h1>
      
      {!summary ? (
        <div className="p-4 bg-yellow-900/50 border border-yellow-700 rounded text-yellow-200">
          No hay datos disponibles. ¿Ya creaste tareas?
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 text-sm uppercase font-semibold">Completadas</h3>
            <p className="text-4xl font-bold text-green-400 mt-2">{summary.total_completed}</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 text-sm uppercase font-semibold">Pendientes</h3>
            <p className="text-4xl font-bold text-yellow-400 mt-2">{summary.total_pending}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-gray-400 text-sm uppercase font-semibold">Tags por tareas</h3>
            <ul className="mt-3 space-y-1">
              {Object.entries(summary.by_tag).map(([tag, count]) => (
                <li key={tag} className="flex justify-between text-sm">
                  <span className="text-blue-300">#{tag}</span>
                  <span className="text-gray-400">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}