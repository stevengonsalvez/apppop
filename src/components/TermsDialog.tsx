import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

interface TermsDialogProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const TermsDialog: React.FC<TermsDialogProps> = ({
  open,
  onClose,
  onAccept,
}) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    maxWidth="md"
    fullWidth
    scroll="paper"
    sx={{
      '& .MuiDialog-paper': {
        maxHeight: '80vh',
      }
    }}
  >
    <DialogTitle>
      <Typography variant="h5" fontWeight="bold">
        Terms and Conditions
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>
    </DialogTitle>
    <DialogContent dividers>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          Welcome to PopAJob. Please read these terms and conditions carefully before using our service.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          By accessing or using PopAJob, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of these terms, you may not access our service.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          1. Definitions
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText 
              primary="Service"
              secondary="Refers to the PopAJob platform, website, and all related services."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="User"
              secondary="Any individual or entity that accesses or uses our Service."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Content"
              secondary="Text, images, videos, audio, or other material posted on our Service."
            />
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          2. User Accounts
        </Typography>
        <Typography variant="body2" paragraph>
          When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText 
              secondary="• You are responsible for safeguarding the password you use to access the Service."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              secondary="• You agree not to disclose your password to any third party."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              secondary="• You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account."
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          3. Intellectual Property
        </Typography>
        <Typography variant="body2" paragraph>
          The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of PopAJob and its licensors.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          4. User Content
        </Typography>
        <Typography variant="body2" paragraph>
          Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the Content that you post on or through the Service.
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText 
              secondary="• You retain any and all rights to any Content you submit, post or display on or through the Service."
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              secondary="• By posting Content, you grant us the right and license to use, modify, perform, display, reproduce, and distribute such Content on and through the Service."
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          5. Termination
        </Typography>
        <Typography variant="body2" paragraph>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          6. Limitation of Liability
        </Typography>
        <Typography variant="body2" paragraph>
          In no event shall PopAJob, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          7. Changes
        </Typography>
        <Typography variant="body2" paragraph>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          8. Contact Us
        </Typography>
        <Typography variant="body2">
          If you have any questions about these Terms, please contact us at support@popajob.com
        </Typography>
      </Box>
    </DialogContent>
    <DialogActions sx={{ p: 3 }}>
      <Button onClick={onClose} variant="outlined">
        Close
      </Button>
      <Button onClick={onAccept} variant="contained">
        I Accept the Terms
      </Button>
    </DialogActions>
  </Dialog>
); 