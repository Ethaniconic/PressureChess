const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function saveGameToBackend(gameData) {
  try {
    const res = await fetch(`${API_URL}/api/games/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend offline or unreachable, game stored locally:', err);
    return null;
  }
}

export async function fetchGameHistory(userId) {
  try {
    const url = userId ? `${API_URL}/api/games/history?user_id=${userId}` : `${API_URL}/api/games/history`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.warn('Error fetching game history:', err);
    return [];
  }
}

export async function fetchUserProfile(userId) {
  try {
    const res = await fetch(`${API_URL}/api/users/${userId}/profile`);
    return await res.json();
  } catch (err) {
    console.warn('Error fetching user profile:', err);
    return null;
  }
}

export async function updateUserProfile(userId, profileData) {
  try {
    const res = await fetch(`${API_URL}/api/users/${userId}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Error updating user profile:', err);
    return null;
  }
}

export async function validateFenWithBackend(fen) {
  try {
    const res = await fetch(`${API_URL}/api/engine/validate-fen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAcademyProgress(userId = 'guest') {
  try {
    const res = await fetch(`${API_URL}/api/academy/progress?user_id=${userId}`);
    return await res.json();
  } catch (err) {
    console.warn('Error fetching academy progress:', err);
    return null;
  }
}

export async function submitCompletedLesson(payload) {
  try {
    const res = await fetch(`${API_URL}/api/academy/complete-lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('Error submitting completed lesson:', err);
    return null;
  }
}

export async function fetchAchievements(userId = 'guest') {
  try {
    const res = await fetch(`${API_URL}/api/academy/achievements?user_id=${userId}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}
