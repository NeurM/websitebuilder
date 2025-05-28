import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/constants';
import { Template } from '@/types/template';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

interface GenericTemplatePageProps {
  templateType: string;
  renderTemplate: (template: Template) => React.ReactNode;
}

export const GenericTemplatePage: React.FC<GenericTemplatePageProps> = ({
  templateType,
  renderTemplate,
}) => {
  const { id } = useParams<{ id: string }>();

  const { data: template, isLoading, error } = useQuery<Template>({
    queryKey: ['template', templateType, id],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.TEMPLATES}/${templateType}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!template) {
    return <ErrorMessage message="Template not found" />;
  }

  return (
    <div className="template-page">
      <header className="template-header">
        <h1>{template.name}</h1>
        <p>{template.description}</p>
      </header>
      <main className="template-content">
        {renderTemplate(template)}
      </main>
    </div>
  );
}; 