import React from 'react';
import { TextField, Button, Box } from '@mui/material';

interface HomeFormProps {
  nickname: string;
  room: string;
  onNicknameChange: (value: string) => void;
  onRoomChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const HomeForm: React.FC<HomeFormProps> = ({
  nickname,
  room,
  onNicknameChange,
  onRoomChange,
  onSubmit,
}) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="Nickname (temporário)"
        value={nickname}
        onChange={e => onNicknameChange(e.target.value)}
        required
        placeholder="Digite seu nickname"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Sala/Grupo"
        value={room}
        onChange={e => onRoomChange(e.target.value)}
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
  );
};

export default HomeForm;
