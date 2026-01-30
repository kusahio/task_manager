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
      <main className="text-center space-y-8 relative z-10 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 leading-tight pb-2">
            Task Manager
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
          Backend en Python. Frontend en Next.js.
          <br />Organiza tu día de forma profesional.
        </p>
        <div className="pt-8">
          <Link href="/login" className="inline-block w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-8 py-4 text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-transform">
              Iniciar Sesión
            </Button>
          </Link>
        </div>

      </main>

      <footer className="absolute bottom-6 text-gray-600 text-sm">
        © {new Date().getFullYear()} Task Manager App
      </footer>
    </div>
  );
}