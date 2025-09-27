export const saveNickname = (nickname: string) => {
  sessionStorage.setItem('nickname', nickname);
};

export const getNickname = (): string | null => {
  return sessionStorage.getItem('nickname');
};
