import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Users, CheckSquare, Trash2 } from 'lucide-react';
import { Project, useProjects } from '@/contexts/ProjectContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const { deleteProject } = useProjects();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const taskStats = {
    total: project.tasks.length,
    done: project.tasks.filter(t => t.status === 'DONE').length,
    inProgress: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
    todo: project.tasks.filter(t => t.status === 'TODO').length,
  };

  const progress = taskStats.total > 0 
    ? Math.round((taskStats.done / taskStats.total) * 100) 
    : 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteProject(project.id);
    toast.success('Projet supprimé avec succès');
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card 
        className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 relative"
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        {/* Delete Button */}
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        {/* Color Header */}
        <div 
          className="h-24 relative"
          style={{ backgroundColor: project.color }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
          <div className="absolute bottom-3 left-4">
            <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center shadow-md">
              <FolderKanban className="w-5 h-5" style={{ color: project.color }} />
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {project.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: project.color 
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <CheckSquare className="w-4 h-4" />
              <span>{taskStats.done}/{taskStats.total} tâches</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{project.members.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le projet</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le projet "{project.name}" ? 
              Cette action est irréversible et supprimera toutes les tâches associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
