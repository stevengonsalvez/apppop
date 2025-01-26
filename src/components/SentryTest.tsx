import React from 'react';
import { Tooltip } from '@mui/material';
import { BugReport as BugIcon } from '@mui/icons-material';

export const SentryTest = () => {
  return (
    <Tooltip title="Test Sentry Error Reporting">
      <BugIcon
        onClick={() => {
          throw new Error("Testing Sentry Error Reporting!");
        }}
        sx={{
          color: '#FF6B6B',
          cursor: 'pointer',
          '&:hover': {
            color: '#FF8E53',
          }
        }}
      />
    </Tooltip>
  );
};