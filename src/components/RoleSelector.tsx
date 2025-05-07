
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from '@/types';
import { UserIcon, ShieldIcon, EyeIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface RoleSelectorProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ activeRole, onRoleChange }) => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs value={activeRole} onValueChange={(value) => onRoleChange(value as UserRole)} className="mb-4">
      <TabsList className={`mb-4 ${isMobile ? "flex flex-wrap gap-1" : ""}`}>
        <TabsTrigger 
          value="user" 
          className={isMobile ? "flex-1 min-w-[100px] text-xs py-1 px-1" : ""}
        >
          <UserIcon className={`h-4 w-4 ${isMobile ? "" : "mr-2"} flex-shrink-0`} />
          <span className={`${isMobile ? "ml-1" : ""}`}>Пользователь 1</span>
        </TabsTrigger>
        <TabsTrigger 
          value="moderator" 
          className={isMobile ? "flex-1 min-w-[100px] text-xs py-1 px-1" : ""}
        >
          <ShieldIcon className={`h-4 w-4 ${isMobile ? "" : "mr-2"} flex-shrink-0`} />
          <span className={`${isMobile ? "ml-1" : ""}`}>Модератор</span>
        </TabsTrigger>
        <TabsTrigger 
          value="guest" 
          className={isMobile ? "flex-1 min-w-[100px] text-xs py-1 px-1" : ""}
        >
          <EyeIcon className={`h-4 w-4 ${isMobile ? "" : "mr-2"} flex-shrink-0`} />
          <span className={`${isMobile ? "ml-1" : ""}`}>Гость</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default RoleSelector;
