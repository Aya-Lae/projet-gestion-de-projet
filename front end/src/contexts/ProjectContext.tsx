import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { projectsAPI, teamAPI, tasksAPI } from '@/services/api';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignee?: string;
  dueDate?: string;
  comments: Comment[];
  images: string[];
  projectId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  tasks: Task[];
  members: string[];
  createdAt: string;
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  projectId: string;
}

interface ProjectContextType {
  projects: Project[];
  teamMembers: TeamMember[];
  isLoading: boolean;
  addProject: (project: Omit<Project, 'id' | 'tasks' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'comments' | 'images' | 'createdAt'>) => Promise<void>;
  updateTask: (projectId: string, taskId: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
  moveTask: (projectId: string, taskId: string, newStatus: Task['status']) => Promise<void>;
  addComment: (projectId: string, taskId: string, text: string, author: string) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  removeTeamMember: (memberId: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  getTaskById: (projectId: string, taskId: string) => Task | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  //  Fonction pour charger les projets depuis le backend
  const fetchProjects = async () => {
    if (!authToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const projectsRes = await projectsAPI.getAll();
      const list = projectsRes.data as any[];
      
      const mapped: Project[] = list.map((p) => ({
        id: p.id?.toString() || Date.now().toString(),
        name: p.name,
        description: p.description,
        color: p.color,
        members: p.members || [],
        // ✅ Mapper "tasks" (ou "taches" selon votre backend)
        tasks: ((p.tasks || p.taches) || []).map((t: any) => ({
          id: t.id?.toString() || Date.now().toString(),
          title: t.title,
          description: t.description || '',
          status: t.status || 'TODO',
          assignee: t.assignee || '',
          dueDate: t.dueDate || '',
          comments: t.comments || [],
          images: t.images || [],
          projectId: p.id?.toString() || '',
          createdAt: t.createdAt || new Date().toISOString(),
        })),
        createdAt: p.createdAt || new Date().toISOString(),
      }));
      
      console.log('Projets chargés:', mapped);
      setProjects(mapped);
    } catch (err) {
      console.error('Erreur lors du chargement des projets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fonction pour charger les membres de l'équipe
  const fetchTeamMembers = async () => {
    if (!authToken) return;

    try {
      const response = await teamAPI.getAll();
      const members = response.data.map((m: any) => ({
        id: m.id?.toString() || Date.now().toString(),
        firstName: m.firstName || m.name?.split(' ')[0] || '',
        lastName: m.lastName || m.name?.split(' ').slice(1).join(' ') || '',
        email: m.email || '',
        projectId: m.projectId?.toString() || '',
      }));
      
      setTeamMembers(members);
    } catch (err) {
      console.error('Erreur lors du chargement des membres:', err);
    }
  };

  // ✅ Écouter les changements de token
  useEffect(() => {
    const onStorage = () => setAuthToken(localStorage.getItem('token'));
    const onAuthChange = () => setAuthToken(localStorage.getItem('token'));
    
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-change', onAuthChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-change', onAuthChange as EventListener);
    };
  }, []);

  // ✅ Charger les données quand le token change
  useEffect(() => {
    if (authToken) {
      fetchProjects();
      fetchTeamMembers();
    } else {
      setProjects([]);
      setTeamMembers([]);
      setIsLoading(false);
    }
  }, [authToken]);

  // ✅ PROJETS
  const addProject = async (project: Omit<Project, 'id' | 'tasks' | 'createdAt'>) => {
    try {
      const res = await projectsAPI.create({ 
        name: project.name, 
        description: project.description, 
        color: project.color 
      });
      
      const saved = res.data;
      const savedProject: Project = {
        id: saved.id?.toString() || Date.now().toString(),
        name: saved.name,
        description: saved.description,
        color: saved.color,
        members: saved.members || project.members || [],
        tasks: saved.tasks || [],
        createdAt: saved.createdAt || new Date().toISOString(),
      };
      
      setProjects(prev => [...prev, savedProject]);
    } catch (err) {
      console.error('Erreur lors de la création du projet:', err);
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await projectsAPI.update(id, updates);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du projet:', err);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsAPI.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du projet:', err);
      throw err;
    }
  };

  // ✅ TÂCHES
  const addTask = async (projectId: string, task: Omit<Task, 'id' | 'comments' | 'images' | 'createdAt'>) => {
    try {
      const res = await tasksAPI.create(projectId, {
        title: task.title,
        description: task.description,
        status: task.status,
        assignee: task.assignee,
        dueDate: task.dueDate,
      });
      
      const savedTask = res.data;
      const newTask: Task = {
        id: savedTask.id?.toString() || Date.now().toString(),
        title: savedTask.title,
        description: savedTask.description,
        status: savedTask.status,
        assignee: savedTask.assignee,
        dueDate: savedTask.dueDate,
        comments: savedTask.comments || [],
        images: savedTask.images || [],
        projectId: projectId,
        createdAt: savedTask.createdAt || new Date().toISOString(),
      };
      
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, tasks: [...p.tasks, newTask] } : p
      ));
    } catch (err) {
      console.error('Erreur lors de la création de la tâche:', err);
      throw err;
    }
  };

  const updateTask = async (projectId: string, taskId: string, updates: Partial<Task>) => {
    try {
      await tasksAPI.update(projectId, taskId, updates);
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) }
          : p
      ));
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la tâche:', err);
      throw err;
    }
  };

  const deleteTask = async (projectId: string, taskId: string) => {
    try {
      await tasksAPI.delete(projectId, taskId);
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
          : p
      ));
    } catch (err) {
      console.error('Erreur lors de la suppression de la tâche:', err);
      throw err;
    }
  };

  const moveTask = async (projectId: string, taskId: string, newStatus: Task['status']) => {
    await updateTask(projectId, taskId, { status: newStatus });
  };

  const addComment = async (projectId: string, taskId: string, text: string, author: string) => {
    try {
      const res = await tasksAPI.addComment(projectId, taskId, text);
      const newComment: Comment = {
        id: res.data.id?.toString() || Date.now().toString(),
        text: res.data.text || text,
        author: res.data.author || author,
        createdAt: res.data.createdAt || new Date().toISOString(),
      };
      
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              tasks: p.tasks.map(t => 
                t.id === taskId 
                  ? { ...t, comments: [...t.comments, newComment] }
                  : t
              ) 
            }
          : p
      ));
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire:', err);
      throw err;
    }
  };

  // ✅ ÉQUIPE
  const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
  try {
    const res = await teamAPI.add(member);
    const newMember: TeamMember = {
      id: res.data.id?.toString() || Date.now().toString(),
      firstName: res.data.firstName || member.firstName,
      lastName: res.data.lastName || member.lastName,
      email: res.data.email || member.email,
      projectId: res.data.projectId?.toString() || member.projectId,
    };
    
    setTeamMembers(prev => [...prev, newMember]);
    
    // ✅ CORRECTION : Ajouter l'EMAIL au lieu du nom complet
    setProjects(prev => prev.map(p => 
      p.id === newMember.projectId 
        ? { ...p, members: [...p.members, newMember.email] } 
        : p
    ));
    
    // ✅ Recharger pour synchroniser avec le backend
    await fetchProjects();
  } catch (err) {
    console.error('Erreur lors de l\'ajout du membre:', err);
    throw err;
  }
};

  const removeTeamMember = async (memberId: string) => {
  try {
    const member = teamMembers.find(m => m.id === memberId);
    
    if (member) {
      await teamAPI.remove(memberId);
      
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
      
      // ✅ CORRECTION : Filtrer par email au lieu du nom complet
      setProjects(prev => prev.map(p => 
        p.id === member.projectId 
          ? { ...p, members: p.members.filter(email => email !== member.email) } 
          : p
      ));
      
      await fetchProjects();
    }
  } catch (err) {
    console.error('Erreur lors de la suppression du membre:', err);
    throw err;
  }
};

  const getProjectById = (id: string) => projects.find(p => p.id === id);
  
  const getTaskById = (projectId: string, taskId: string) => {
    const project = getProjectById(projectId);
    return project?.tasks.find(t => t.id === taskId);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      teamMembers,
      isLoading,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      addComment,
      addTeamMember,
      removeTeamMember,
      getProjectById,
      getTaskById,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
