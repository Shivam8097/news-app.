import React, { useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link,
  CircularProgress,
  Grid
} from '@mui/material';

function NewsDigest({ articles, loading, language = 'en' }) {
  const handleSpeak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      // Try to find a voice that matches the language exactly, or by prefix (e.g., 'es' for 'es-ES')
      let voice = voices.find(v => v.lang === language) || voices.find(v => v.lang.startsWith(language));
      if (!voice) {
        alert('Sorry, your browser does not have a voice for this language.');
        return;
      }
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.voice = voice;
      synth.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  }, [language]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!articles.length) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Your Personalized News Digest
      </Typography>
      <Grid container spacing={3}>
        {articles.map((article, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {article.image_url && (
                <CardMedia
                  component="img"
                  height="140"
                  image={article.image_url}
                  alt={article.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {article.summary}
                </Typography>
                <button onClick={() => handleSpeak(article.summary)} style={{ marginBottom: 8 }}>
                  🔊 Hear Summary
                </button>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Source: {article.source}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(article.published_date).toLocaleDateString()}
                  </Typography>
                </Box>
                {article.url && (
                  <Link
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 2, display: 'block' }}
                  >
                    Read full article
                  </Link>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default NewsDigest; 