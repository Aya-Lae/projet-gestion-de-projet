import React from 'react';
import { Sun, Moon, Type } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Settings: React.FC = () => {
  const { theme, fontSize, setTheme, setFontSize } = useTheme();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Personnalisez votre expérience
        </p>
      </div>

      {/* Theme Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'light' ? (
              <Sun className="w-5 h-5 text-warning" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
            Thème
          </CardTitle>
          <CardDescription>
            Choisissez le thème de l'interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as 'light' | 'dark')}
            className="grid grid-cols-2 gap-4"
          >
            <Label
              htmlFor="light"
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                theme === 'light' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <RadioGroupItem value="light" id="light" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center shadow-sm">
                  <Sun className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium">Clair</p>
                  <p className="text-sm text-muted-foreground">Interface lumineuse</p>
                </div>
              </div>
            </Label>

            <Label
              htmlFor="dark"
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                theme === 'dark' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <RadioGroupItem value="dark" id="dark" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sidebar rounded-lg flex items-center justify-center">
                  <Moon className="w-5 h-5 text-sidebar-foreground" />
                </div>
                <div>
                  <p className="font-medium">Sombre</p>
                  <p className="text-sm text-muted-foreground">Interface sombre</p>
                </div>
              </div>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Font Size Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5 text-primary" />
            Taille de la police
          </CardTitle>
          <CardDescription>
            Ajustez la taille du texte pour plus de confort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={fontSize}
            onValueChange={(value) => setFontSize(value as 'small' | 'normal' | 'large')}
            className="grid grid-cols-3 gap-4"
          >
            <Label
              htmlFor="small"
              className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                fontSize === 'small' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <RadioGroupItem value="small" id="small" className="sr-only" />
              <span className="text-sm">Aa</span>
              <span className="text-sm font-medium">Petite</span>
            </Label>

            <Label
              htmlFor="normal"
              className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                fontSize === 'normal' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <RadioGroupItem value="normal" id="normal" className="sr-only" />
              <span className="text-base">Aa</span>
              <span className="text-sm font-medium">Normale</span>
            </Label>

            <Label
              htmlFor="large"
              className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                fontSize === 'large' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <RadioGroupItem value="large" id="large" className="sr-only" />
              <span className="text-lg">Aa</span>
              <span className="text-sm font-medium">Grande</span>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
