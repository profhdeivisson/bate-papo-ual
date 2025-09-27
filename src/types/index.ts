export interface Room {
  name: string;
}

export interface User {
  nickname: string;
}

export interface UserJoinedData {
  nickname: string;
}

export interface UserLeftData {
  nickname: string;
}

export interface MessageData {
  nickname: string;
  text: string;
  timestamp: number;
}

export interface TypingData {
  nickname: string;
}
