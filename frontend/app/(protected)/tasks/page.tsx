'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Task, taskService } from '@/services/task';
import { Tag, tagService } from '@/services/tag';
import TaskList from './_components/TaskList';
import TaskForm from './_components/TaskForm';

export default function TaskPage(){
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () =>{
    try{
      const [taskData, tagsData] = await Promise.all([
      taskService.getAll(),
      tagService.getAll()
    ]);

    setTasks(taskData);
    setTags(tagsData);
    } catch (err: any){
      toast.error(`Hubo un error al cargar los datos | ${err}`)
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-2'>Mis tareas</h1>
      </div>
      {loading ? (
        <div className='flex justify-center py-20'>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
          <div className='lg:col-span-1'>
            <div className='sticky top-6'>
              <TaskForm tags={tags} onSuccess={loadData}/>
            </div>
          </div>

          <div className='lg:col-span-2'>
            <div className='bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 min-h-[500px]'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-white'>Pendientes</h2>
                <span className='bg-blue-900/50 text-blue-200 text-xs px-3 py-1 rounded-full border border-blue-800'>
                  {tasks.filter(task => !task.completed).length} tareas pendientes
                </span>
              </div>
              <TaskList tasks={tasks} onTaskUpdate={loadData}/>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}