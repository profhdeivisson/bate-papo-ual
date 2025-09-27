import { Container, Paper, ThemeProvider, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ActiveRoomsList from '../components/ActiveRoomsList';
import HomeForm from '../components/HomeForm';
import { fetchActiveRooms } from '../services/rooms';
import { theme } from '../themes';
import { saveNickname } from '../utils/session';

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState('');
  const [activeRooms, setActiveRooms] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadRooms = async () => {
      const rooms = await fetchActiveRooms();
      setActiveRooms(rooms);
    };
    loadRooms();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname && room) {
      saveNickname(nickname);
      router.push(`/chat/${room}`);
    }
  };

  const joinRoom = (roomName: string) => {
    if (nickname) {
      saveNickname(nickname);
      router.push(`/chat/${roomName}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Bate-papo <strong>Ual</strong>
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <HomeForm
            nickname={nickname}
            room={room}
            onNicknameChange={setNickname}
            onRoomChange={setRoom}
            onSubmit={handleSubmit}
          />
          <ActiveRoomsList
            activeRooms={activeRooms}
            nickname={nickname}
            onJoinRoom={joinRoom}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Nicknames são temporários e por sessão. Salas são públicas—qualquer
            um pode entrar.
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
