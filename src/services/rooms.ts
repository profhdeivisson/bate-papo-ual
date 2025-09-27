export const fetchActiveRooms = async (): Promise<string[]> => {
  try {
    const res = await fetch('/api/rooms');
    const data = await res.json();
    return data.rooms || [];
  } catch (err) {
    console.error('Error fetching rooms:', err);
    return [];
  }
};
