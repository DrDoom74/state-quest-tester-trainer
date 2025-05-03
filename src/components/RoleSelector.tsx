
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserIcon, ShieldIcon, EyeIcon } from 'lucide-react';
import { UserRole } from '@/types';

interface RoleSelectorProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ activeRole, onRoleChange }) => {
  return (
    <TabsList className="mb-4">
      <TabsTrigger value="user" selected={activeRole === 'user'}>
        <UserIcon className="h-4 w-4 mr-2" />
        Пользователь 1
      </TabsTrigger>
      <TabsTrigger value="moderator" selected={activeRole === 'moderator'}>
        <ShieldIcon className="h-4 w-4 mr-2" />
        Модератор
      </TabsTrigger>
      <TabsTrigger value="guest" selected={activeRole === 'guest'}>
        <EyeIcon className="h-4 w-4 mr-2" />
        Гость
      </TabsTrigger>
    </TabsList>
  );
};

export default RoleSelector;
