import React, { useState } from 'react';
import { Calendar, User, MessageSquare, Send, Trash2, Image } from 'lucide-react';
import { Task, useProjects } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  projectId: string;
  members: string[];
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  open, 
  onClose, 
  task,
  projectId,
  members
}) => {
  const { updateTask, addComment, deleteTask } = useProjects();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const statusColors = {
    TODO: 'bg-muted text-muted-foreground',
    IN_PROGRESS: 'bg-accent text-accent-foreground',
    DONE: 'bg-success/10 text-success',
  };

  const handleSave = () => {
    updateTask(projectId, task.id, editedTask);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    addComment(projectId, task.id, newComment.trim(), `${user.firstName} ${user.lastName}`);
    setNewComment('');
  };

  const handleDelete = () => {
    deleteTask(projectId, task.id);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="pr-8">
              {isEditing ? (
                <Input 
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="text-xl font-semibold"
                />
              ) : (
                task.title
              )}
            </DialogTitle>
            <Badge className={statusColors[task.status]}>
              {task.status === 'TODO' && 'À faire'}
              {task.status === 'IN_PROGRESS' && 'En cours'}
              {task.status === 'DONE' && 'Terminé'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            {isEditing ? (
              <Textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                rows={4}
              />
            ) : (
              <p className="text-muted-foreground">
                {task.description || 'Aucune description'}
              </p>
            )}
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" /> Assigné à
              </Label>
              {isEditing ? (
                <Select 
                  value={editedTask.assignee || ''} 
                  onValueChange={(v) => setEditedTask({ ...editedTask, assignee: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Non assigné" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-muted-foreground">{task.assignee || 'Non assigné'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date limite
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedTask.dueDate || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                />
              ) : (
                <p className="text-muted-foreground">
                  {task.dueDate 
                    ? new Date(task.dueDate).toLocaleDateString('fr-FR') 
                    : 'Non définie'}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select 
                  value={editedTask.status} 
                  onValueChange={(v) => setEditedTask({ ...editedTask, status: v as Task['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">À faire</SelectItem>
                    <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                    <SelectItem value="DONE">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Images */}
          {task.images.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Image className="w-4 h-4" /> Images
              </Label>
              <div className="flex gap-2 flex-wrap">
                {task.images.map((img, i) => (
                  <img 
                    key={i} 
                    src={img} 
                    alt="" 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Commentaires ({task.comments.length})
            </Label>
            
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {task.comments.map((comment) => (
                <div key={comment.id} className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button size="icon" onClick={handleAddComment} disabled={!newComment.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>
                    Enregistrer
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
