import querystring from "querystring";
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
// const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player`;
const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN;

// const REDIRECT_URI = "http://localhost:3000";

interface NowPlayingItem {
  albumImageUrl: string;
  artist: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
}

const getAccessToken = async (): Promise<any> => {
  const basic = btoa(`${client_id}:${client_secret}`);
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

export const getNowPlaying = async (
  client_id: string,
  client_secret: string,
  refresh_token: string
): Promise<Response> => {
  //   const { access_token } = await getAccessToken();
  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${refresh_token}`,
    },
  });
};

export default async function getNowPlayingItem(
  client_id: string,
  client_secret: string,
  refresh_token: string
): Promise<NowPlayingItem | false> {
  const response = await getNowPlaying(client_id, client_secret, refresh_token);
  console.log(response);
  if (response.status === 204 || response.status > 400) {
    return false;
  }
  const song = await response.json();
  const albumImageUrl = song.item.album.images[0].url;
  const artist = song.item.artists
    .map((_artist: { name: string }) => _artist.name)
    .join(", ");
  const isPlaying = song.is_playing;
  const songUrl = song.item.external_urls.spotify;
  const title = song.item.name;

  return {
    albumImageUrl,
    artist,
    isPlaying,
    songUrl,
    title,
  };
}

// ? how to get the refresh token
// fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//         'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
//         'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: 'grant_type=client_credentials'
// })
// .then(response => response.json())
// .then(data => {
//     var token = data.access_token;
//     console.log(token);
// })
// .catch(error => {
//     console.error(error);
// });
