import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  ThemeProvider,
  createTheme,
} from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: 'Lato, sans-serif',
  },
  palette: {
    primary: {
      main: '#007bff',
    },
  },
});

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState('');
  const [activeRooms, setActiveRooms] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => setActiveRooms(data.rooms))
      .catch(err => console.error('Error fetching rooms:', err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname && room) {
      sessionStorage.setItem('nickname', nickname);
      router.push(`/chat/${room}`);
    }
  };

  const joinRoom = (roomName: string) => {
    if (nickname) {
      sessionStorage.setItem('nickname', nickname);
      router.push(`/chat/${roomName}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Bate-papo Uau
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Nickname (temporário)"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              required
              placeholder="Digite seu nickname"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Sala/Grupo"
              value={room}
              onChange={e => setRoom(e.target.value)}
              required
              placeholder="ex.: geral ou tech-talk"
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
            >
              Entrar na Sala
            </Button>
          </Box>
          {activeRooms.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Salas Ativas:
              </Typography>
              <List>
                {activeRooms.map(roomName => (
                  <ListItem key={roomName} disablePadding>
                    <ListItemButton
                      onClick={() => joinRoom(roomName)}
                      disabled={!nickname}
                    >
                      <ListItemText primary={`Entrar em ${roomName}`} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Nicknames são temporários e por sessão. Salas são públicas—qualquer um pode entrar.
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
