'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Task, taskService } from '@/services/task';
import TaskItem from './TaskItem';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface TaskListProps{
  tasks: Task[];
  onTaskUpdate: () => void;
}

export default function TaskList({tasks, onTaskUpdate} : TaskListProps) {
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async (task: Task) => {
    try{
      await taskService.toggleComplete(task.id, task.completed);
      onTaskUpdate();

      !task.completed 
        ? toast.success('¡Tarea marcada como completada!') 
        : toast.info('La tarea ha vuelto a estar pendiente');
    } catch (err: any){
      toast.error(`Hubo un error al actualizar la tarea | ${err}`)
    }
  }

  const confirmDelete = async () => {
    if (taskToDelete === null) return;

    setIsDeleting(true);

    try{
      await taskService.delete(taskToDelete);
      toast.success('La tarea ha sido eliminada');
      onTaskUpdate();
      setTaskToDelete(null);
    } catch (err: any){
      toast.error(`Ha ocurrido un error al intentar eliminar la tarea | ${err}`)
    } finally{
      setIsDeleting(false)
    }
  }

  if (tasks.length === 0){
    return (
      <div className='text-center py-10 text-gray-500 bg-gray-800/50 rounded-xl border border-dashed border-gray-700'>
        <p className='text-lg'>No hay tareas pendientes</p>
      </div>
    )
  }

  return (
    <>
      <div className='space-y-3'>
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={(id) => setTaskToDelete(id)}/>
        ))}
      </div>
      <Modal isOpen={taskToDelete !== null} onClose={() => setTaskToDelete(null)} title='¿Eliminar Tarea?'>
        <div className='space-y-4 '>
          <p className='text-gray-300'>Esta acción no se puede deshacer. ¿Estás seguro?</p>
          <div className='flex justify-end gap-3 pt-2'>
            <Button
              variant='ghost'
              onClick={() => setTaskToDelete(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant='danger'
              onClick={confirmDelete}
              isLoading={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}