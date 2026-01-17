import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, CheckSquare, Clock, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useProjects } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Dashboard: React.FC = () => {
  const { projects, teamMembers } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();

  const allTasks = projects.flatMap(p => p.tasks);
  const stats = {
    totalProjects: projects.length,
    totalTasks: allTasks.length,
    completedTasks: allTasks.filter(t => t.status === 'DONE').length,
    inProgressTasks: allTasks.filter(t => t.status === 'IN_PROGRESS').length,
    todoTasks: allTasks.filter(t => t.status === 'TODO').length,
    teamMembers: teamMembers.length,
  };

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  const recentProjects = [...projects].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">
          Bonjour, {user?.firstName} {user?.lastName} 👋
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de vos projets et tâches
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projets</p>
                <p className="text-3xl font-bold mt-1">{stats.totalProjects}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tâches complètes</p>
                <p className="text-3xl font-bold mt-1">{stats.completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-3xl font-bold mt-1">{stats.inProgressTasks}</p>
              </div>
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Équipe</p>
                <p className="text-3xl font-bold mt-1">{stats.teamMembers}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Progress */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Progression globale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary">{completionRate}%</p>
                <p className="text-muted-foreground mt-1">des tâches terminées</p>
              </div>
              <Progress value={completionRate} className="h-3" />
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-secondary rounded-lg p-2">
                  <p className="font-semibold">{stats.todoTasks}</p>
                  <p className="text-muted-foreground text-xs">À faire</p>
                </div>
                <div className="bg-accent rounded-lg p-2">
                  <p className="font-semibold">{stats.inProgressTasks}</p>
                  <p className="text-muted-foreground text-xs">En cours</p>
                </div>
                <div className="bg-success/10 rounded-lg p-2">
                  <p className="font-semibold text-success">{stats.completedTasks}</p>
                  <p className="text-muted-foreground text-xs">Terminé</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Projets récents</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
              Voir tout
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => {
                const progress = project.tasks.length > 0
                  ? Math.round((project.tasks.filter(t => t.status === 'DONE').length / project.tasks.length) * 100)
                  : 0;

                return (
                  <div 
                    key={project.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: project.color + '20' }}
                    >
                      <FolderKanban className="w-5 h-5" style={{ color: project.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {project.tasks.length} tâches • {project.members.length} membres
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{progress}%</p>
                      <div className="w-20 h-2 bg-secondary rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ width: `${progress}%`, backgroundColor: project.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {recentProjects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun projet pour le moment</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => navigate('/projects')}
                  >
                    Créer votre premier projet
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
