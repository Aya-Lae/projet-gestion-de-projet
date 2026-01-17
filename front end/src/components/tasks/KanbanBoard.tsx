import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task, useProjects } from '@/contexts/ProjectContext';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  projectId: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const columns: { id: Task['status']; title: string; color: string }[] = [
  { id: 'TODO', title: 'À faire', color: 'kanban-todo' },
  { id: 'IN_PROGRESS', title: 'En cours', color: 'kanban-progress' },
  { id: 'DONE', title: 'Terminé', color: 'kanban-done' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, tasks, onTaskClick }) => {
  const { moveTask } = useProjects();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as Task['status'];
    
    moveTask(projectId, draggableId, newStatus);
  };

  const getTasksByStatus = (status: Task['status']) => 
    tasks.filter(task => task.status === status);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className={cn(
                "flex items-center gap-2 p-3 rounded-t-lg",
                `bg-${column.color}`
              )} style={{
                backgroundColor: column.id === 'TODO' 
                  ? 'hsl(var(--kanban-todo))' 
                  : column.id === 'IN_PROGRESS' 
                    ? 'hsl(var(--kanban-progress))' 
                    : 'hsl(var(--kanban-done))'
              }}>
                <h3 className="font-semibold">{column.title}</h3>
                <span className="ml-auto bg-background/80 text-foreground px-2 py-0.5 rounded-full text-sm">
                  {columnTasks.length}
                </span>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 min-h-[300px] p-3 space-y-3 rounded-b-lg transition-colors",
                      snapshot.isDraggingOver 
                        ? "bg-accent/50" 
                        : "bg-secondary/30"
                    )}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard 
                              task={task} 
                              onClick={() => onTaskClick(task)}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
