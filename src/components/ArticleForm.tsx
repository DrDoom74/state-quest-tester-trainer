
import React, { useState, useEffect, useRef } from 'react';
import { Article, ArticleCategory } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { XIcon } from 'lucide-react';
import { useBugs } from '@/hooks/useBugs';

interface ArticleFormProps {
  article?: Article;
  onSubmit: (title: string, content: string, category: ArticleCategory) => void;
  onCancel: () => void;
}

const CATEGORIES: ArticleCategory[] = ['Technology', 'Science', 'Health', 'Business', 'Entertainment'];

const ArticleForm: React.FC<ArticleFormProps> = ({
  article,
  onSubmit,
  onCancel
}) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [category, setCategory] = useState<ArticleCategory>(article?.category || 'Technology');
  const [errors, setErrors] = useState({
    title: '',
    content: ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialRender = useRef(true);
  
  const { checkForBug } = useBugs();
  
  const isEditing = !!article;

  // Track changes when editing an existing article
  useEffect(() => {
    if (isEditing && !initialRender.current) {
      const titleChanged = title !== article.title;
      const contentChanged = content !== article.content;
      const categoryChanged = category !== article.category;
      setHasChanges(titleChanged || contentChanged || categoryChanged);
    }
    // After the first render, set initialRender to false
    if (initialRender.current) {
      initialRender.current = false;
    }
  }, [title, content, category, article, isEditing]);

  const validate = () => {
    const newErrors = {
      title: '',
      content: ''
    };
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

  // Detect bug with improved synchronization
  const detectBug = () => {
    if (isEditing && !hasChanges) {
      console.log("Detecting save without changes bug!");
      // Вызываем checkForBug напрямую без Promise
      return checkForBug(
        'save-without-changes-bug',
        'Обнаружен баг! Кнопка сохранить изменения доступна без внесения изменений в статью',
        'Сохранение статьи без внесения изменений'
      );
    }
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // First detect any bugs
      const bugDetected = detectBug();
      console.log("Bug detected:", bugDetected);
      
      if (!validate()) {
        toast({
          title: "Ошибка валидации",
          description: "Пожалуйста, исправьте ошибки в форме",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // If validation passes, call onSubmit
      onSubmit(title, content, category);
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении статьи",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
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
            <Input id="title" placeholder="Введите заголовок статьи" value={title} onChange={e => setTitle(e.target.value)} className={errors.title ? "border-red-500" : ""} />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
            <div className="text-xs text-gray-500">
              {title.length}/100 символов
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Категория <span className="text-red-500">*</span></Label>
            <Select value={category} onValueChange={value => setCategory(value as ArticleCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Текст статьи <span className="text-red-500">*</span></Label>
            <Textarea id="content" placeholder="Введите текст статьи" value={content} onChange={e => setContent(e.target.value)} className={`min-h-[150px] ${errors.content ? "border-red-500" : ""}`} />
            {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
            <div className="text-xs text-gray-500">
              {content.length} символов (минимум 20)
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button 
              type="submit" 
              className="text-base"
              disabled={isSubmitting}
            >
              {isEditing ? 'Сохранить изменения' : 'Создать статью'}
            </Button>
          </div>
        </form>
      </div>
    </div>;
};

export default ArticleForm;
