import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Close as CloseIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { alpha, useTheme } from '@mui/material/styles';

const MotionBox = motion(Box);

interface DocWidgetProps {
  title: string;
  markdownContent: string;
  color: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const DocWidget: React.FC<DocWidgetProps> = ({ title, markdownContent, color, isOpen, setIsOpen }) => {
  const theme = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionBox
          initial={{ 
            position: 'fixed',
            top: '100%',
            left: 0,
            right: 0,
            height: '100%',
            zIndex: 1000,
          }}
          animate={{ 
            top: 0,
            transition: {
              type: "spring",
              damping: 30,
              stiffness: 200,
            }
          }}
          exit={{ 
            top: '100%',
            transition: {
              type: "spring",
              damping: 30,
              stiffness: 200,
            }
          }}
          sx={{
            bgcolor: 'background.paper',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box 
            sx={{ 
              p: 3,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: `linear-gradient(135deg, ${alpha(color, 0.8)}, ${alpha(color, 0.4)})`,
            }}
          >
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              {title}
            </Typography>
            <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box 
            sx={{ 
              p: 4,
              flex: 1,
              overflow: 'auto',
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
              }
            }}
          >
            <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            </Box>
          </Box>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}; 