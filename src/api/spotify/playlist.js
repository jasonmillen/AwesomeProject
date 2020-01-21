export const createPlaylist = async (spotifyUserID, accessToken) => {
  const uri = `${SPOTIFY_BASE_URL}/users/${userID}/playlists`;
  const res = await fetch(uri, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      
    })
  });
  const json = await res.json();

  console.log('SEARCH USER RESPONSE', json);

  if (json.error && json.error.status === 404) {
    console.log('User not found');
    return null;
  }
  else if (json.id && json.id.length > 0) {
    console.log('User found: ', json.id);
    return json;
  }
};