import React, { useState, useEffect } from 'react';
import { Box, Link, Typography, List, ListItem, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents: React.FC = () => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const theme = useTheme();

  useEffect(() => {
    // Function to extract headings from the page
    const extractHeadings = () => {
      const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const items: TocItem[] = headingElements.map((heading) => {
        const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
        
        // Set an ID if it doesn't exist
        if (!heading.id) {
          heading.id = id;
        }
        
        return {
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.substring(1)) // Extract the heading level (h1 = 1, h2 = 2, etc.)
        };
      });
      
      setTocItems(items);
    };

    extractHeadings();

    // Set up intersection observer for highlighting active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' } // Consider a heading "active" when it's in the top 20% of the viewport
    );

    // Observe all heading elements
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <List sx={{ p: 0 }}>
      {tocItems.map((item) => (
        <ListItem 
          key={item.id}
          disablePadding
          sx={{ 
            mb: 1,
            pl: (item.level - 1) * 1.5, // Indent based on heading level
          }}
        >
          <Link
            href={`#${item.id}`}
            underline="none"
            sx={{
              color: item.id === activeId 
                ? theme.palette.primary.main 
                : theme.palette.text.secondary,
              fontWeight: item.id === activeId ? 'bold' : 'normal',
              fontSize: 14 - (item.level * 0.5), // Decrease font size for deeper levels
              display: 'block',
              pl: 1,
              borderLeft: '2px solid',
              borderColor: item.id === activeId 
                ? theme.palette.primary.main 
                : 'transparent',
              '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
              transition: 'all 0.2s',
            }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {item.text}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}; 