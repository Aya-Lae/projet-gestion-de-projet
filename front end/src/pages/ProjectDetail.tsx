import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Calendar } from 'lucide-react';
import { useProjects, Task } from '@/contexts/ProjectContext';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById } = useProjects();
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const project = getProjectById(id!);

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">Projet non trouvé</h2>
        <p className="text-muted-foreground mb-4">Ce projet n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate('/projects')}>
          Retour aux projets
        </Button>
      </div>
    );
  }

  const taskStats = {
    total: project.tasks.length,
    done: project.tasks.filter(t => t.status === 'DONE').length,
    inProgress: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
    todo: project.tasks.filter(t => t.status === 'TODO').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: project.color }}
            />
            <h1 className="text-3xl font-heading font-bold">{project.name}</h1>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Badge variant="secondary" className="gap-1">
              <Users className="w-3 h-3" />
              {project.members.length} membre{project.members.length > 1 ? 's' : ''}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Calendar className="w-3 h-3" />
              Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR')}
            </Badge>
            <div className="flex gap-2">
              <Badge variant="outline">{taskStats.todo} à faire</Badge>
              <Badge className="bg-accent text-accent-foreground">{taskStats.inProgress} en cours</Badge>
              <Badge className="bg-success/10 text-success">{taskStats.done} terminé</Badge>
            </div>
          </div>
        </div>

        <Button onClick={() => setShowCreateTaskModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Kanban Board */}
      <KanbanBoard 
        projectId={project.id}
        tasks={project.tasks}
        onTaskClick={setSelectedTask}
      />

      {/* Modals */}
      <CreateTaskModal
        open={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        projectId={project.id}
        members={project.members}
      />

      {selectedTask && (
        <TaskDetailModal
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          projectId={project.id}
          members={project.members}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
