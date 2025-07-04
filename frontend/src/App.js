import React, { useState, useEffect } from 'react';
import { 
  Container, 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  Box,
  Typography,
  TextField,
  Button,
  Paper
} from '@mui/material';
import NewsDigest from './components/NewsDigest';
import PreferenceForm from './components/PreferenceForm';
import { register, login } from './api';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userId, setUserId] = useState(() => localStorage.getItem('user_id'));
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (userId) localStorage.setItem('user_id', userId);
    else localStorage.removeItem('user_id');
  }, [userId]);

  const handlePreferencesSubmit = async (preferences) => {
    setLoading(true);
    setError(null);
    setSelectedLanguage(preferences.language || 'en');
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/digest' 
        : 'http://localhost:5000/api/digest';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      setArticles(data.articles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (authMode === 'login') {
        const res = await login(username, password);
        if (res.user_id) {
          setUserId(res.user_id);
        } else {
          setAuthError(res.error || 'Login failed');
        }
      } else {
        const res = await register(username, password);
        if (res.message) {
          setAuthMode('login');
          setAuthError('Registration successful! Please log in.');
        } else {
          setAuthError(res.error || 'Registration failed');
        }
      }
    } catch (err) {
      setAuthError('Server error');
    }
  };

  const handleLogout = () => {
    setUserId(null);
    setUsername('');
    setPassword('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            AI News Digest
          </Typography>
          {!userId ? (
            <Paper sx={{ p: 3, mb: 4, maxWidth: 400, mx: 'auto' }}>
              <Typography variant="h5" align="center" gutterBottom>
                {authMode === 'login' ? 'Login' : 'Register'}
              </Typography>
              <form onSubmit={handleAuth}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                {authError && (
                  <Typography color="error" align="center" sx={{ mt: 1 }}>
                    {authError}
                  </Typography>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  {authMode === 'login' ? 'Login' : 'Register'}
                </Button>
                <Button
                  onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(null); }}
                  color="secondary"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  {authMode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
                </Button>
              </form>
            </Paper>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button onClick={handleLogout} color="secondary" variant="outlined">
                  Logout
                </Button>
              </Box>
              <PreferenceForm onSubmit={handlePreferencesSubmit} loading={loading} />
              {error && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <NewsDigest articles={articles} loading={loading} language={selectedLanguage} userId={userId} />
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
