import { ReactNode, CSSProperties } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminEditButton } from './AdminEditButton';
import { useOptimizedHomepageContent } from '@/hooks/useOptimizedHomepageContent';
import { useFeaturesContent } from '@/hooks/useFeaturesContent';


interface AdminContentWrapperProps {
  sectionId: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  contentType?: 'homepage' | 'features';
}

export function AdminContentWrapper({ 
  sectionId, 
  children, 
  className = '', 
  style,
  contentType = 'homepage'
}: AdminContentWrapperProps) {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  
  console.log('AdminContentWrapper Debug:', {
    sectionId,
    contentType,
    user: user?.email,
    isAdmin,
    userId: user?.id
  });
  const { getContentBySection: getHomepageContent, updateContent: updateHomepageContent, refetch: refetchHomepage } = useOptimizedHomepageContent();
  const { getContentBySection: getFeaturesContent, updateContent: updateFeaturesContent, refetch: refetchFeatures } = useFeaturesContent();

  
  const currentContent = contentType === 'features' 
    ? getFeaturesContent(sectionId) 
          : getHomepageContent(sectionId);

  const updateFunction = contentType === 'features' 
    ? updateFeaturesContent 
          : updateHomepageContent;

  const refetchFunction = contentType === 'features' 
    ? refetchFeatures 
          : refetchHomepage;

  return (
    <div className={`relative ${className}`} style={style}>
      {isAdmin && (
        <AdminEditButton 
          sectionId={sectionId} 
          currentContent={currentContent} 
          contentType={contentType}
          updateContent={updateFunction}
          refetch={refetchFunction}
        />
      )}
      {children}
    </div>
  );
}