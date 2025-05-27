import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Website Builder</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Create beautiful websites for your clients with our easy-to-use platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Browse our collection of professional templates</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/templates')} className="w-full">
              View Templates
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Manage your websites and clients</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Websites</CardTitle>
            <CardDescription>Access your saved website projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/saved-websites')} className="w-full">
              View Saved Websites
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 