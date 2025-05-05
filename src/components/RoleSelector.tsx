
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from '@/types';
import { UserIcon, ShieldIcon, EyeIcon } from 'lucide-react';

interface RoleSelectorProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ activeRole, onRoleChange }) => {
  return (
    <Tabs value={activeRole} onValueChange={(value) => onRoleChange(value as UserRole)} className="mb-4">
      <TabsList className="mb-4">
        <TabsTrigger value="user">
          <UserIcon className="h-4 w-4 mr-2" />
          Пользователь 1
        </TabsTrigger>
        <TabsTrigger value="moderator">
          <ShieldIcon className="h-4 w-4 mr-2" />
          Модератор
        </TabsTrigger>
        <TabsTrigger value="guest">
          <EyeIcon className="h-4 w-4 mr-2" />
          Гость
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default RoleSelector;
