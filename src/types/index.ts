
export type ArticleStatus = 
  | 'draft' 
  | 'moderation' 
  | 'rejected' 
  | 'published' 
  | 'unpublished' 
  | 'archived';

export type ArticleCategory = 
  | 'Technology' 
  | 'Science' 
  | 'Health' 
  | 'Business' 
  | 'Entertainment';

export type UserRole =
  | 'user'
  | 'moderator'
  | 'guest';

export interface Article {
  id: string;
  title: string;
  content: string;
  status: ArticleStatus;
  category: ArticleCategory;
  createdAt: Date;
  updatedAt: Date;
  wasEdited?: boolean;
}

export interface Bug {
  id: string;
  description: string;
  actionDescription: string;
  dateFound: Date;
}

export type ActionType = 
  | 'edit'
  | 'submitForModeration'
  | 'publish'
  | 'reject'
  | 'unpublish'
  | 'republish'
  | 'archive'
  | 'delete';
