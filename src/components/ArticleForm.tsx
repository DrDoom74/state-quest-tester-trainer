
import React, { useState, useEffect } from 'react';
import { Article, ArticleCategory } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { XIcon } from 'lucide-react';
import { useBugs } from '@/hooks/useBugs';

interface ArticleFormProps {
  article?: Article;
  onSubmit: (title: string, content: string, category: ArticleCategory) => void;
  onCancel: () => void;
}

const CATEGORIES: ArticleCategory[] = [
  'Technology',
  'Science',
  'Health',
  'Business',
  'Entertainment'
];

const ArticleForm: React.FC<ArticleFormProps> = ({ 
  article, 
  onSubmit, 
  onCancel 
}) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [category, setCategory] = useState<ArticleCategory>(article?.category || 'Technology');
  const [errors, setErrors] = useState({ title: '', content: '' });
  const [hasChanges, setHasChanges] = useState(false);
  const { checkForBug } = useBugs();
  
  const isEditing = !!article;
  
  // Track changes when editing an existing article
  useEffect(() => {
    if (isEditing) {
      const titleChanged = title !== article.title;
      const contentChanged = content !== article.content;
      const categoryChanged = category !== article.category;
      
      setHasChanges(titleChanged || contentChanged || categoryChanged);
    }
  }, [title, content, category, article, isEditing]);
  
  const validate = () => {
    const newErrors = { title: '', content: '' };
    let isValid = true;
    
    if (!title.trim()) {
      newErrors.title = 'Заголовок обязателен';
      isValid = false;
    } else if (title.length > 100) {
      newErrors.title = 'Заголовок не должен превышать 100 символов';
      isValid = false;
    }
    
    if (!content.trim()) {
      newErrors.content = 'Текст статьи обязателен';
      isValid = false;
    } else if (content.length < 20) {
      newErrors.content = 'Текст статьи должен содержать не менее 20 символов';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Всегда проверять наличие бага "save without changes" перед валидацией
    // Это гарантирует, что мы поймаем баг до любых других проверок
    if (isEditing && !hasChanges) {
      console.log("Detected save without changes bug!");
      checkForBug(
        'save-without-changes-bug',
        'Обнаружен баг! Кнопка сохранить изменения доступна без внесенияя изменений в статью',
        'Сохранение статьи без внесения изменений'
      );
    }
    
    if (!validate()) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, исправьте ошибки в форме",
        variant: "destructive",
      });
      return;
    }
    
    // Вызываем onSubmit в любом случае, чтобы сохранить функциональность приложения
    onSubmit(title, content, category);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Редактирование статьи' : 'Создание новой статьи'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="Введите заголовок статьи"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <div className="text-red-500 text-sm mt-1">{errors.title}</div>
            )}
            <div className="text-xs text-gray-500">
              {title.length}/100 символов
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Категория <span className="text-red-500">*</span></Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as ArticleCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Текст статьи <span className="text-red-500">*</span></Label>
            <Textarea
              id="content"
              placeholder="Введите текст статьи"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`min-h-[150px] ${errors.content ? "border-red-500" : ""}`}
            />
            {errors.content && (
              <div className="text-red-500 text-sm mt-1">{errors.content}</div>
            )}
            <div className="text-xs text-gray-500">
              {content.length} символов (минимум 20)
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button type="submit">
              {isEditing ? 'Сохранить изменения' : 'Создать статью'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;
