'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useTags } from '@/hooks/useTags';
import { useTaskDelete } from '@/hooks/useTaskDelete';
import { taskService } from '@/services/task';
import { toast } from 'sonner';
import TaskList from './_components/TaskList';
import TaskForm from './_components/TaskForm';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import Spinner from '@/components/ui/Spinner';
import { Task } from '@/types/task';

export default function TaskPage() {
  const { tasks, loading, loadData } = useTasks();
  const { tags } = useTags();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { taskToDelete, setTaskToDelete, isDeleting, confirmDelete } = useTaskDelete(loadData);

  const handleToggle = async (task: Task) => {
    try {
      await taskService.toggleComplete(task.id, task.completed);
      loadData();
      toast.success(task.completed ? 'La tarea ha vuelto a estar pendiente' : '¡Tarea marcada como completada!');
    } catch {
      toast.error('Hubo un error al actualizar la tarea');
    }
  };

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='mb-6 md:mb-8'>
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>Mis Tareas</h1>
      </div>

      {loading ? (
        <div className='flex justify-center py-20'>
          <Spinner />
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start'>
          <div className='lg:col-span-1'>
            <div className='lg:col-span-1 md:sticky lg:sticky top-6 z-10'>
              <TaskForm tags={tags} onSuccess={loadData} />
            </div>
          </div>

          <div className='lg:col-span-2'>
            <div className='bg-gray-800/30 rounded-xl p-4 md:p-6 border border-gray-700/50 min-h-75 md:min-h-125'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
                <h2 className='text-xl font-bold text-white'>Pendientes</h2>
                <span className='bg-blue-900/50 text-blue-200 text-xs px-3 py-1 rounded-full border border-blue-800'>
                  {tasks.filter(task => !task.completed).length} tareas pendientes
                </span>
              </div>

              <TaskList
                tasks={tasks}
                onToggle={handleToggle}
                onDeleteRequest={(id) => setTaskToDelete(id)}
                onEditTask={(task) => setEditingTask(task)}
              />
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={editingTask !== null} onClose={() => setEditingTask(null)} title="">
        <TaskForm
          tags={tags}
          taskToEdit={editingTask}
          onSuccess={() => { loadData(); setEditingTask(null); }}
          onCancel={() => setEditingTask(null)}
        />
      </Modal>

      <ConfirmModal
        isOpen={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDelete}
        title="¿Eliminar Tarea?"
        message="Esta acción no se puede deshacer. ¿Estás seguro?"
        isLoading={isDeleting}
      />
    </div>
  );
}