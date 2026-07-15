import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <main className="text-center space-y-8 relative z-10 max-w-2xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-soft" />
          Proyecto personal en evolución
        </div>

        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 leading-tight pb-2">
              TaskFlow
            </span>
          </h1>
        </div>

        <p className="text-lg md:text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
          Gestión de tareas con asistencia de IA.
          <br />Organiza tu día de forma inteligente.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700/50">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            FastAPI + Next.js
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700/50">
            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Gemini IA
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700/50">
            PostgreSQL + JWT
          </div>
        </div>

        <div className="pt-6">
          <Link href="/login" className="inline-block w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-8 py-4 text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-6 text-gray-600 text-sm">
        © {new Date().getFullYear()} TaskFlow
      </footer>
    </div>
  );
}
