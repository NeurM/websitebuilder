import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { User } from '@/types/api';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useToast } from '@/components/ui/use-toast';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth() as { user: User | null; logout: () => Promise<void> };
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Success',
        description: 'You have been successfully logged out.',
      });
      navigate('/login');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Logout failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <NavigationMenu className="max-w-full px-4 py-2">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className="text-lg font-bold">
            Website Builder
          </Link>
        </NavigationMenuItem>

        {user ? (
          <>
            <NavigationMenuItem>
              <Link to="/templates" className="px-4 py-2 hover:text-primary">
                Templates
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/dashboard" className="px-4 py-2 hover:text-primary">
                Dashboard
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/saved-websites" className="px-4 py-2 hover:text-primary">
                Saved Websites
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="ml-auto">
              <NavigationMenuTrigger>{`${user.first_name} ${user.last_name}`}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[200px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </>
        ) : (
          <NavigationMenuItem className="ml-auto">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register" className="ml-2">
              <Button>Register</Button>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}; 