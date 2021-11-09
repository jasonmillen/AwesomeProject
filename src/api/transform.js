export const spotifyUserToSsUser = (user) => {
  return {
    displayName: user.display_name,
    imageUrl: user.images && user.images.length > 0 ? user.images[0].url : null,
    spotifyUserID: user.id,
  };
}