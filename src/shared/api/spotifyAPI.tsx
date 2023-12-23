import querystring from "querystring";
import { Buffer } from "buffer";
import { getFromCache, saveToCache } from "../utils/cache";
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me`;
const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID || "";
const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || "";
const refresh_token = process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN || "";
const redirect_uri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI || "";

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const response_type = "code";
const scope = "user-read-private user-read-email";

interface NowPlayingItem {
  albumImageUrl: string;
  artist: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
}

/**
 * Retrieves the access token from Spotify API using the client credentials.
 * @returns A Promise that resolves to the access token.
 */
const getAccessToken = async (code_token: string): Promise<any> => {
  console.log("getAccessToken" + code_token);

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code_token,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    json: true,
  };

  // Make the API request to get the access token
  const response = await fetch(authOptions.url, {
    method: "POST",
    headers: authOptions.headers,
    body: querystring.stringify(authOptions.form),
  });

  return await response.json();
};

/**
 * Retrieves the currently playing track from Spotify API.
 * @param client_id - The Spotify client ID.
 * @param client_secret - The Spotify client secret.
 * @param code_token - The Spotify refresh token.
 * @returns A Promise that resolves to the response from the API.
 */
export const getNowPlaying = async (
  client_id: string,
  client_secret: string,
  code_token: string
): Promise<Response> => {
  const { access_token } = getFromCache("spotifyToken") || {
    access_token: null,
  };
  if (!access_token) {
    console.log("No access token found, fetching new one");

    const { access_token, expires_in } = await getAccessToken(code_token);
    saveToCache(
      "spotifyToken",
      { access_token, expires_in },
      new Date(Date.now() + expires_in * 1000)
    );
  }

  return fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: { Authorization: `Bearer ${access_token}` },
  });
};

/**
 * Retrieves the currently playing track details from Spotify API.
 * @param client_id - The Spotify client ID.
 * @param client_secret - The Spotify client secret.
 * @param code_token - The Spotify refresh token.
 * @returns A Promise that resolves to the currently playing track details or false if no track is playing.
 */
export default async function getNowPlayingItem(
  client_id: string,
  client_secret: string,
  code_token: string
): Promise<NowPlayingItem | false> {
  const response = await getNowPlaying(client_id, client_secret, code_token);
  if (response.status === 204 || response.status > 400) {
    console.info(response.status, response.statusText);
    return false;
  }

  //Extracting the required data from the response into seperate variables
  const song = await response.json();
  const timePlayed = song.progress_ms;
  const timeTotal = song.item.duration_ms;
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
