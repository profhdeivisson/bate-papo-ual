import { ExitToApp } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import io, { Socket } from 'socket.io-client';
import type { UserJoinedData, UserLeftData, MessageData, TypingData } from '../../types';

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

interface SystemMessage {
  system: true;
  text: string;
}

type ChatMessage = MessageData | SystemMessage;

let socket: Socket;

export default function ChatRoom() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const roomParam = router.query.room;
  const room = typeof roomParam === 'string' ? roomParam : roomParam?.[0] || '';
  const nicknameRef = useRef('');

  useEffect(() => {
    if (!room) return;

    const storedNickname = sessionStorage.getItem('nickname');
    console.log('storedNickname:', storedNickname);
    if (!storedNickname || storedNickname.trim() === '') {
      router.push('/');
      return;
    }
    nicknameRef.current = storedNickname;
    setNickname(storedNickname);

    socket = io();

    socket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      const isRejoin = localStorage.getItem('inRoom-' + room) === 'true';
      socket.emit(isRejoin ? 'rejoin-room' : 'join-room', { room, nickname: nicknameRef.current });
      localStorage.setItem('inRoom-' + room, 'true');
    });

    socket.on('previous-messages', (messages: any[]) => {
      setMessages(messages);
    });

    socket.on('new-message', (msgData: any) => {
      setMessages(prev => [...prev, msgData]);
    });

    socket.on('user-joined', (data: any) => {
      setMessages(prev => [
        ...prev,
        { system: true, text: `${data.nickname} entrou na sala.` },
      ]);
    });

    socket.on('user-left', (data: any) => {
      setMessages(prev => [
        ...prev,
        { system: true, text: `${data.nickname} saiu da sala.` },
      ]);
    });

    socket.on('user-typing', (data: any) => {
      setTypingUsers(prev => [...new Set([...prev, data.nickname])]);
    });

    socket.on('user-stop-typing', (data: any) => {
      setTypingUsers(prev => prev.filter(user => user !== data.nickname));
    });

    return () => {
      socket.disconnect();
    };
  }, [room, router]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('send-message', {
        room,
        text: message,
        nickname: nicknameRef.current,
      });
      socket.emit('stop-typing', { room, nickname: nicknameRef.current });
      setMessage('');
    }
  };

  const handleTyping = () => {
    if (socket && message.trim()) {
      socket.emit('typing', { room, nickname });
    }
  };

  const handleStopTyping = () => {
    if (socket) {
      socket.emit('stop-typing', { room, nickname });
    }
  };

  if (!room) return <Typography>Loading...</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Sala: {room}
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Você: {nickname} | Status:{' '}
              {connected ? 'Conectado' : 'Conectando...'}
            </Typography>
            <IconButton color="inherit" onClick={() => setOpenLeaveDialog(true)}>
              <ExitToApp />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: 'grey.100' }}>
          <Container maxWidth="md">
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      width: '100%',
                      bgcolor: ('system' in msg && msg.system) ? 'grey.200' : 'white',
                    }}
                  >
                    {('system' in msg && msg.system) ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        {(msg as SystemMessage).text}
                      </Typography>
                    ) : (
                      <Box>
                        <Typography variant="subtitle2" component="strong">
                          {(msg as MessageData).nickname}:
                        </Typography>
                        <Typography variant="body1">{(msg as MessageData).text}</Typography>
                      </Box>
                    )}
                  </Paper>
                </ListItem>
              ))}
            </List>
            {typingUsers.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {typingUsers.map(user => (
                  <Chip
                    key={user}
                    label={`${user} está digitando...`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                ))}
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Container>
        </Box>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Container maxWidth="md">
            <Box
              component="form"
              onSubmit={sendMessage}
              sx={{ display: 'flex', gap: 1 }}
            >
              <TextField
                fullWidth
                value={message}
                onChange={e => setMessage(e.target.value)}
                onInput={handleTyping}
                onBlur={handleStopTyping}
                placeholder="Digite uma mensagem..."
                disabled={!connected}
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!connected || !message.trim()}
                sx={{ px: 3 }}
              >
                Enviar
              </Button>
            </Box>
          </Container>
        </Paper>
        <Dialog open={openLeaveDialog} onClose={() => setOpenLeaveDialog(false)}>
          <DialogTitle>Sair da Sala</DialogTitle>
          <DialogContent>
            <Typography>Tem certeza que deseja sair da sala?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLeaveDialog(false)}>Cancelar</Button>
            <Button onClick={() => {
              if (socket) {
                socket.emit('leave-room', { room, nickname: nicknameRef.current });
              }
              localStorage.removeItem('inRoom-' + room);
              router.push('/');
            }} color="primary">
              Sair
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
