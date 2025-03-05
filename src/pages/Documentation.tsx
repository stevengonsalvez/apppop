import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { alpha, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { DocumentationLayout } from '../components/DocumentationLayout';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

const MotionBox = motion(Box);

interface DocParams {
  docPath: string;
}

export const DocumentationPage: React.FC = () => {
  const { docPath } = useParams<DocParams>();
  const theme = useTheme();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Documentation');
  const [isLoading, setIsLoading] = useState(true);
  const isNavigating = useRef(false);

  useEffect(() => {
    setIsLoading(true);
    isNavigating.current = true;
    
    // Set document title
    let docTitle = 'Documentation';
    
    // Map document paths to titles
    const docTitles: Record<string, string> = {
      'introduction': 'Welcome to AppPop!',
      'setup': 'Quick Start Guide',
      'development': 'Development Guide',
      'auth': 'Authentication Guide',
      'theme-system': 'Theme System',
      'components': 'Component Library',
      'profile': 'User Profile System',
      'GoogleAnalytics': 'Google Analytics Integration',
      'gtm-setup': 'Google Tag Manager Setup',
      'gtm-usage-guide': 'Google Tag Manager Usage Guide',
      'cookieconsent': 'Cookie Consent Management',
      'monitoring': 'Monitoring & Error Tracking',
      'heatmap': 'Heatmap Analytics',
      'analytics': 'Analytics Overview',
      'ci': 'CI/CD Pipeline',
    };
    
    if (docPath in docTitles) {
      docTitle = docTitles[docPath];
    }
    
    setTitle(docTitle);
    document.title = `${docTitle} | AppPop Documentation`;

    // Fetch the markdown content
    fetch(`/docs/${docPath}.md`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load documentation');
        }
        return response.text();
      })
      .then(content => {
        setContent(content);
        setIsLoading(false);
        setTimeout(() => {
          isNavigating.current = false;
        }, 300);
      })
      .catch(error => {
        console.error('Error loading documentation:', error);
        setContent(`# Document Not Found

We couldn't find the documentation you're looking for. Please try one of the following:

- Check the URL and try again
- Browse other documentation topics in the sidebar

If you believe this is an error, please contact support.`);
        setIsLoading(false);
        setTimeout(() => {
          isNavigating.current = false;
        }, 300);
      });
  }, [docPath]);

  // Add a cleanup effect to reset navigation status when component unmounts
  useEffect(() => {
    return () => {
      isNavigating.current = false;
    };
  }, []);

  return (
    <DocumentationLayout title={title}>
      <MotionBox
        key={`doc-${docPath}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
        layoutId="documentation-content"
        sx={{ 
          position: 'relative',
          zIndex: 1
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Box 
            sx={{ 
              pt: 0,
              mt: 0,
              pl: 3,
              ml: 0,
              '& img': { maxWidth: '100%' },
              '& pre': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                p: 2,
                borderRadius: 2,
                overflow: 'auto'
              },
              '& code': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                p: 0.5,
                borderRadius: 1,
              },
              '& table': {
                borderCollapse: 'collapse',
                width: '100%',
                '& th, & td': {
                  border: `1px solid ${theme.palette.divider}`,
                  p: 1,
                }
              },
              '& h1': {
                color: theme.palette.text.primary,
                mb: 4,
                scrollMarginTop: '80px'
              },
              '& h2, & h3, & h4': {
                color: theme.palette.text.primary,
                mt: 4,
                mb: 2,
                scrollMarginTop: '80px'
              },
              '& p': {
                color: theme.palette.text.secondary,
                lineHeight: 1.7
              },
              '& ul, & ol': {
                color: theme.palette.text.secondary,
                '& li': {
                  mb: 1
                }
              }
            }}
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeSlug]}
            >
              {content}
            </ReactMarkdown>
          </Box>
        )}
      </MotionBox>
    </DocumentationLayout>
  );
}; 