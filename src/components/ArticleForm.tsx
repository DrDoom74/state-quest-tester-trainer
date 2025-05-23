
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
import { useLanguage } from '@/hooks/useLanguage';

interface ArticleFormProps {
  article?: Article;
  onSubmit: (title: string, content: string, category: ArticleCategory) => void;
  onCancel: () => void;
}

const CATEGORIES: ArticleCategory[] = ['Technology', 'Science', 'Health', 'Business', 'Entertainment'];
const MAX_CONTENT_LENGTH = 1000;

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
  
  const { checkActionForBug } = useBugs();
  const { t } = useLanguage();
  
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
      newErrors.title = t('form.error.titleRequired');
      isValid = false;
    } else if (title.length > 100) {
      newErrors.title = t('form.error.titleTooLong');
      isValid = false;
    }
    
    if (!content.trim()) {
      newErrors.content = t('form.error.contentRequired');
      isValid = false;
    } else if (content.length < 20) {
      newErrors.content = t('form.error.contentTooShort');
      isValid = false;
    } else if (content.length > MAX_CONTENT_LENGTH) {
      newErrors.content = t('form.error.contentTooLong').replace('{{max}}', MAX_CONTENT_LENGTH.toString());
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const detectBug = () => {
    if (isEditing && !hasChanges) {
      console.log("Detecting save without changes bug!");
      
      setTimeout(() => {
        console.log("Checking for save-unchanged bug using checkActionForBug");
        checkActionForBug('', 'save-unchanged');
      }, 10);
      
      return true;
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
          title: t('form.error.validationFailed'),
          description: t('form.error.fixErrors'),
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
        title: t('form.error.title'),
        description: t('form.error.description'),
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? t('form.editArticle') : t('form.createArticle')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('form.titleLabel')} <span className="text-red-500">*</span></Label>
            <Input id="title" placeholder={t('form.titlePlaceholder')} value={title} onChange={e => setTitle(e.target.value)} className={errors.title ? "border-red-500" : ""} />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
            <div className="text-xs text-gray-500">
              {title.length}/100 {t('form.characters')}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">{t('form.categoryLabel')} <span className="text-red-500">*</span></Label>
            <Select value={category} onValueChange={value => setCategory(value as ArticleCategory)}>
              <SelectTrigger>
                <SelectValue placeholder={t('form.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">{t('form.contentLabel')} <span className="text-red-500">*</span></Label>
            <Textarea id="content" placeholder={t('form.contentPlaceholder')} value={content} onChange={e => setContent(e.target.value)} className={`min-h-[150px] ${errors.content ? "border-red-500" : ""}`} />
            {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
            <div className="text-xs text-gray-500">
              {content.length}/{MAX_CONTENT_LENGTH} {t('form.characters')} ({t('form.min')} 20, {t('form.max')} {MAX_CONTENT_LENGTH})
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('form.cancel')}
            </Button>
            <Button 
              type="submit" 
              className="text-base"
              disabled={isSubmitting}
            >
              {isEditing ? t('form.saveChanges') : t('form.create')}
            </Button>
          </div>
        </form>
      </div>
    </div>;
};

export default ArticleForm;
