import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Skeleton } from '@/components/ui/skeleton';

interface TranslatedTextProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  showLoading?: boolean;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  children, 
  as: Component = 'span', 
  className = '',
  showLoading = false 
}) => {
  const { translate, currentLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedText(children);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    translate(children).then((result) => {
      if (isMounted) {
        setTranslatedText(result);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [children, currentLanguage, translate]);

  if (showLoading && isLoading) {
    return <Skeleton className={`h-4 w-24 inline-block ${className}`} />;
  }

  return React.createElement(Component, { className }, translatedText);
};

export default TranslatedText;
