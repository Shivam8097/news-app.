import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress
} from '@mui/material';

const topics = [
  'technology',
  'science',
  'business',
  'health',
  'sports',
  'entertainment',
  'politics',
  'world'
];

function PreferenceForm({ onSubmit, loading }) {
  const [selectedTopics, setSelectedTopics] = useState([]);

  const handleTopicChange = (topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ topics: selectedTopics });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Select Your News Preferences
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
            {topics.map((topic) => (
              <FormControlLabel
                key={topic}
                control={
                  <Checkbox
                    checked={selectedTopics.includes(topic)}
                    onChange={() => handleTopicChange(topic)}
                    disabled={loading}
                  />
                }
                label={topic.charAt(0).toUpperCase() + topic.slice(1)}
              />
            ))}
          </Box>
        </FormGroup>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || selectedTopics.length === 0}
            sx={{ minWidth: 200 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Get News Digest'
            )}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default PreferenceForm; 