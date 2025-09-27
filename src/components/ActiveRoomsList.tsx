import React from 'react';
import { Typography, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';

interface ActiveRoomsListProps {
  activeRooms: string[];
  nickname: string;
  onJoinRoom: (roomName: string) => void;
}

const ActiveRoomsList: React.FC<ActiveRoomsListProps> = ({
  activeRooms,
  nickname,
  onJoinRoom,
}) => {
  if (activeRooms.length === 0) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Salas Ativas:
      </Typography>
      <List>
        {activeRooms.map(roomName => (
          <ListItem key={roomName} disablePadding>
            <ListItemButton
              onClick={() => onJoinRoom(roomName)}
              disabled={!nickname}
            >
              <ListItemText primary={`Entrar em ${roomName}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ActiveRoomsList;
