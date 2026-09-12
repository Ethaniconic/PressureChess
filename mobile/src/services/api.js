const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000'; // 10.0.2.2 for Android emulator

function handleNetworkError(tag, err) {
  const msg = err?.message || String(err);
  const isOffline = msg.includes('ConnectException') || 
                    msg.includes('Network request failed') || 
                    msg.includes('Failed to connect') ||
                    msg.includes('ECONNREFUSED');
  if (!isOffline) {
    console.warn(`${tag}:`, err);
  }
}

export async function saveGameToBackend(gameData) {
  try {
    const res = await fetch(`${API_URL}/api/games/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData)
    });
    return await res.json();
  } catch (err) {
    handleNetworkError('saveGameToBackend', err);
    return null;
  }
}

export async function fetchGameHistory(userId) {
  try {
    const url = userId ? `${API_URL}/api/games/history?user_id=${userId}` : `${API_URL}/api/games/history`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    handleNetworkError('fetchGameHistory', err);
    return [];
  }
}

export async function fetchUserProfile(userId) {
  try {
    const res = await fetch(`${API_URL}/api/users/${userId}/profile`);
    return await res.json();
  } catch (err) {
    handleNetworkError('fetchUserProfile', err);
    return null;
  }
}

export async function fetchAcademyProgress(userId) {
  try {
    const url = userId ? `${API_URL}/api/academy/progress?user_id=${userId}` : `${API_URL}/api/academy/progress`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    handleNetworkError('fetchAcademyProgress', err);
    return null;
  }
}

export async function submitLessonCompletion(data) {
  try {
    const res = await fetch(`${API_URL}/api/academy/complete-lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.warn('Error submitting lesson completion:', err);
    return null;
  }
}

export async function fetchUserAchievements(userId) {
  try {
    const url = userId ? `${API_URL}/api/academy/achievements?user_id=${userId}` : `${API_URL}/api/academy/achievements`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.warn('Error fetching user achievements:', err);
    return [];
  }
}

export async function submitBetaFeedback(feedbackObj) {
  try {
    const res = await fetch(`${API_URL}/api/beta/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackObj)
    });
    return await res.json();
  } catch (err) {
    console.warn('Error submitting beta feedback:', err);
    return null;
  }
}

export async function fetchBetaChangelog() {
  try {
    const res = await fetch(`${API_URL}/api/beta/changelog`);
    return await res.json();
  } catch (err) {
    console.warn('Error fetching beta changelog:', err);
    return [];
  }
}

export async function trackBetaEvent(eventObj) {
  try {
    const res = await fetch(`${API_URL}/api/beta/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventObj)
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function updateBetaNotificationPreferences(prefs) {
  try {
    const res = await fetch(`${API_URL}/api/beta/notifications/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs)
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

