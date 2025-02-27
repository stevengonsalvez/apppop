import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { alpha, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { features } from './Dashboard'; // Import the features array from Dashboard

const MotionBox = motion(Box);

interface DocParams {
  docPath: string;
}

export const DocumentationPage: React.FC = () => {
  const { docPath } = useParams<DocParams>();
  const history = useHistory();
  const theme = useTheme();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<{
    title: string;
    color: string;
  }>({ title: '', color: theme.palette.primary.main });

  useEffect(() => {
    // Find the matching documentation from features array
    const docFeature = features.find(
      (f) => 
        f.type === 'documentation' && 
        f.markdownPath === `/docs/${docPath}.md`
    );

    if (docFeature && 'docTitle' in docFeature) {
      setMetadata({
        title: docFeature.docTitle,
        color: docFeature.color,
      });
    }

    // Fetch the markdown content
    fetch(`/docs/${docPath}.md`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load documentation');
        }
        return response.text();
      })
      .then(setContent)
      .catch(error => {
        console.error('Error loading documentation:', error);
        setContent('# Error\nFailed to load documentation content.');
      });
  }, [docPath]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box 
        sx={{ 
          p: 3,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: `linear-gradient(135deg, ${alpha(metadata.color, 0.8)}, ${alpha(metadata.color, 0.4)})`,
        }}
      >
        <IconButton 
          onClick={() => history.push('/')} 
          sx={{ 
            color: 'white',
            '&:hover': {
              bgcolor: alpha('#fff', 0.1)
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          {metadata.title}
        </Typography>
      </Box>

      <Box 
        sx={{ 
          p: 4,
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
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
            mb: 4
          },
          '& h2, & h3, & h4': {
            color: theme.palette.text.primary,
            mt: 4,
            mb: 2
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
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Loading documentation...
            </Typography>
          </Box>
        )}
      </Box>
    </MotionBox>
  );
}; 