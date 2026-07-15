'use client';

import { useCallback, useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useTags } from '@/hooks/useTags';
import { useTaskDelete } from '@/hooks/useTaskDelete';
import TaskList from './_components/TaskList';
import TaskForm from './_components/TaskForm';
import AIChatPanel from '@/components/AIChat/AIChatPanel';
import ConfirmModal from '@/components/ConfirmModal';
import { taskService } from '@/services/task';
import { Task } from '@/types/task';
import { toast } from 'sonner';

export default function TasksPage() {
  const { tasks, loading, loadData: refresh } = useTasks();
  const { tags } = useTags();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { taskToDelete, setTaskToDelete, isDeleting, confirmDelete } = useTaskDelete(refresh);

  const handleToggle = useCallback(async (task: Task) => {
    try {
      await taskService.toggleComplete(task.id, task.completed);
      refresh();
    } catch {
      toast.error('Error al cambiar el estado de la tarea');
    }
  }, [refresh]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto relative">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Tareas</h1>
      </div>

      {loading ? (
        <div className="text-white text-center py-12">Cargando tareas...</div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDeleteRequest={(id) => setTaskToDelete(id)}
            onEditTask={(task) => setEditingTask(task)}
          />
        </div>
      )}

      {/* Edit modal */}
      {editingTask && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg">
            <TaskForm
              tags={tags}
              onSuccess={() => { refresh(); setEditingTask(null); }}
              taskToEdit={editingTask}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDelete}
        title="¿Eliminar tarea?"
        message="Esta acción no se puede deshacer."
      />

      {/* Floating AI Panel */}
      <AIChatPanel tags={tags} onTaskCreated={refresh} />
    </div>
  );
}
