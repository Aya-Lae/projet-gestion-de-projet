import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckSquare, Clock, ListTodo, AlertCircle, Calendar, FolderKanban } from 'lucide-react';
import { useProjects, Task } from '@/contexts/ProjectContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type TaskFilter = 'done' | 'in-progress' | 'todo' | 'incomplete';

const filterConfig: Record<TaskFilter, { 
  title: string; 
  icon: React.ElementType; 
  status?: Task['status'];
  description: string;
}> = {
  'done': { 
    title: 'Tâches complètes', 
    icon: CheckSquare, 
    status: 'DONE',
    description: 'Toutes les tâches terminées'
  },
  'in-progress': { 
    title: 'Tâches en cours', 
    icon: Clock, 
    status: 'IN_PROGRESS',
    description: 'Tâches actuellement en développement'
  },
  'todo': { 
    title: 'Tâches à faire', 
    icon: ListTodo, 
    status: 'TODO',
    description: 'Tâches en attente'
  },
  'incomplete': { 
    title: 'Tâches incomplètes', 
    icon: AlertCircle,
    description: 'Tâches non terminées (À faire + En cours)'
  },
};

const Tasks: React.FC = () => {
  const { filter } = useParams<{ filter: TaskFilter }>();
  const navigate = useNavigate();
  const { projects } = useProjects();

  const config = filterConfig[filter as TaskFilter] || filterConfig['todo'];
  const Icon = config.icon;

  const allTasks = projects.flatMap(p => 
    p.tasks.map(t => ({ ...t, projectName: p.name, projectColor: p.color }))
  );

  const filteredTasks = allTasks.filter(task => {
    if (filter === 'incomplete') {
      return task.status !== 'DONE';
    }
    return task.status === config.status;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const isOverdue = (task: typeof filteredTasks[0]) => 
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">{config.title}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card 
              key={task.id}
              className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(`/projects/${task.projectId}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: task.projectColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <FolderKanban className="w-3 h-3" />
                        <span>{task.projectName}</span>
                      </div>
                      {task.dueDate && (
                        <div className={`flex items-center gap-1 ${
                          isOverdue(task) ? 'text-destructive' : 'text-muted-foreground'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                      {task.assignee && (
                        <Badge variant="outline" className="text-xs">
                          {task.assignee}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge 
                    className={
                      task.status === 'DONE' 
                        ? 'bg-success/10 text-success' 
                        : task.status === 'IN_PROGRESS'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                    }
                  >
                    {task.status === 'DONE' && 'Terminé'}
                    {task.status === 'IN_PROGRESS' && 'En cours'}
                    {task.status === 'TODO' && 'À faire'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl">
          <Icon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold mb-2">Aucune tâche</h3>
          <p className="text-muted-foreground">
            Il n'y a aucune tâche dans cette catégorie
          </p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
