import React from 'react';
import { User, Mail, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Mon Profil</h1>
        <p className="text-muted-foreground mt-1">
          Consultez vos informations personnelles
        </p>
      </div>

      {/* Profile Card */}
      <Card className="border-0 shadow-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-primary" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-primary-foreground">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <h2 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prénom</p>
                <p className="font-medium">{user?.firstName || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium">{user?.lastName || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || '-'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
