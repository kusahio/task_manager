import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// src/app/page.tsx
export default async function Home() {

  const session = await getServerSession(authOptions)

  if(session){
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Todo List App</h1>
      <p className="mt-4 text-xl">Backend con Python y Frontend Next js</p>
    </main>
  );
}