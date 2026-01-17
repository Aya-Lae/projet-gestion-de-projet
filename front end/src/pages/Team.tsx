import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Trash2, RefreshCw } from 'lucide-react';
import { useProjects } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import api from '@/services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Team: React.FC = () => {
  const { projects, teamMembers, addTeamMember, removeTeamMember } = useProjects();
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState(''); // ✅ Changé de selectedUserId à selectedUserEmail
  const [projectId, setProjectId] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      setIsRefreshing(true);
      const response = await api.get('/users');
      console.log('✅ Utilisateurs chargés:', response.data);
      
      // ✅ Filtrer les utilisateurs supprimés (ceux qui n'ont plus de données valides)
      const validUsers = response.data.filter((u: User) => 
        u.email && u.firstName && u.lastName
      );
      
      setAvailableUsers(validUsers);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error);
      toast.error('Impossible de charger les utilisateurs');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAvailableUsers();
    toast.info('Liste des utilisateurs actualisée');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserEmail || !projectId) {
      toast.error('Veuillez sélectionner un utilisateur et un projet');
      return;
    }

    // ✅ Chercher l'utilisateur par EMAIL
    const selectedUser = availableUsers.find(u => u.email === selectedUserEmail);
    
    if (!selectedUser) {
      console.error('❌ Utilisateur introuvable dans la liste');
      console.log('Email recherché:', selectedUserEmail);
      console.log('Utilisateurs disponibles:', availableUsers);
      toast.error('Utilisateur non trouvé dans la liste');
      return;
    }

    console.log('✅ Utilisateur sélectionné:', selectedUser);
    console.log('📤 Envoi au backend:', {
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      email: selectedUser.email,
      projectId,
    });

    setIsLoading(true);

    try {
      await addTeamMember({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        projectId,
      });

      setSelectedUserEmail('');
      setProjectId('');
      
      toast.success('Membre ajouté avec succès !');
      
      // ✅ Recharger la liste après ajout
      await fetchAvailableUsers();
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'ajout du membre:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data 
        || 'Erreur lors de l\'ajout du membre';
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (memberId: string, memberName: string) => {
    setMemberToDelete({ id: memberId, name: memberName });
  };

  const confirmDelete = async () => {
    if (memberToDelete) {
      try {
        await removeTeamMember(memberToDelete.id);
        toast.success('Membre supprimé avec succès');
        setMemberToDelete(null);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression du membre');
      }
    }
  };

  const getProjectName = (id: string) => {
    const project = projects.find(p => p.id === id);
    return project?.name || 'Projet inconnu';
  };

  const getProjectColor = (id: string) => {
    const project = projects.find(p => p.id === id);
    return project?.color || '#6366f1';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold">Équipe</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les membres de votre équipe
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Ajouter un membre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ✅ Ajout du bouton de rafraîchissement */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Utilisateur</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                </div>
                {/* ✅ Utiliser EMAIL comme valeur au lieu de ID */}
                <Select value={selectedUserEmail} onValueChange={setSelectedUserEmail}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.length > 0 ? (
                      availableUsers.map((user) => (
                        <SelectItem key={user.email} value={user.email}>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Aucun utilisateur disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {availableUsers.length} utilisateur(s) disponible(s)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Projet associé</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: project.color }}
                            />
                            {project.name}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Aucun projet disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                <UserPlus className="w-4 h-4 mr-2" />
                {isLoading ? 'Ajout en cours...' : 'Ajouter le membre'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Membres de l'équipe ({teamMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamMembers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Membre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Projet</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {member.firstName?.[0] ?? ''}{member.lastName?.[0] ?? ''}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {member.firstName} {member.lastName}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            {member.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: getProjectColor(member.projectId) }}
                            />
                            {getProjectName(member.projectId)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(member.id, `${member.firstName} ${member.lastName}`)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun membre dans l'équipe</p>
                <p className="text-sm mt-1">
                  Ajoutez votre premier membre via le formulaire
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le membre</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {memberToDelete?.name} de l'équipe ? 
              Cette action est irréversible.
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
    </div>
  );
};

export default Team;
