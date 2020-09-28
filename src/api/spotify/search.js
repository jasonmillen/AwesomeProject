import { debounce } from '../../utility/util';

const apiPrefix = 'https://api.spotify.com/v1';

const search = async ({
  offset,
  limit,
  q,
  token,
}) => {
  const uri = `${apiPrefix}/search?type=track&limit=${limit}&offset=${offset}&q=${encodeURIComponent(q)}`;
  console.log('search query: ', q);
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  const json = await res.json();

  if (!res.ok) {
    return [];
  }

  const {
    tracks: {
      items,
    }
  } = json;

  return items.map(item => ({
    id: item.id,
    title: item.name,
    artist: item.artists.length > 0 && item.artists[0].name ? item.artists[0].name : '',
    album: item.album.name || '',
    imageUri: item.album.images
      ? item.album.images[0].url
      : undefined
  }));
};

export const debouncedSearch = debounce(search, 50);

export default search;