import "../../styles/spotify.css";
import { useEffect, useState } from "react";
import getNowPlayingItem from "../../shared/api/spotifyAPI";
import React from "react";
// import SpotifyLogo from "./SpotifyLogo";
// import SpotifyPlayingAnimation from "./SpotifyPlayingAnimation";
const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID || "";
const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || "";
const refresh_token = process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN || "";
const redirect_uri =
  process.env.REACT_APP_SPOTIFY_REDIRECT_URI || "http://localhost:3000";

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

interface SpotifyNowPlayingProps {
  client_id: string;
  client_secret: string;
  refresh_token: string;
}

interface SpotifyResult {
  albumImageUrl: string;
  title: string;
  songUrl: string;
  artist: string;
}
var scope =
  "user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative user-read-playback-position user-library-read";

var url = "https://accounts.spotify.com/authorize";
url += "?response_type=code";
url += "&client_id=" + encodeURIComponent(client_id);
url += "&scope=" + encodeURIComponent(scope);
url += "&redirect_uri=" + encodeURIComponent(redirect_uri);

export const SpotifyNowPlaying: React.FC<SpotifyNowPlayingProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SpotifyResult | null>(null);
  const [code, setCode] = useState<string>("");
  // check on load, if there is content in the uri param. if there is a code then get it
  // and pass it to the getAccessToken function

  useEffect(() => {
    var resCode = "";
    if (window.location.search) {
      resCode = new URLSearchParams(window.location.search).get("code") || "";
      console.log(resCode);
      setCode(resCode);
    }
  }, [window.location]);

  // need to update at end of each song
  useEffect(() => {
    if (code) {
      Promise.all([
        getNowPlayingItem(props.client_id, props.client_secret, code),
      ]).then((results) => {
        setResult(results[0] || null);
        setLoading(false);
      });
    }
  }, [code]);

  const isPlaying = result?.title && result?.artist;

  return (
    <div className="card card-medium">
      {loading && <p>Loading...</p>}
      {!loading && !isPlaying && (
        <div>
          {/* <SpotifyLogo /> */}
          <span>Currently offline</span>

          <a href={url}>Login to Spotify</a>
        </div>
      )}
      {!loading && isPlaying && (
        <div>
          <div>
            {/* <SpotifyLogo /> */}
            <span>Now playing</span>
          </div>
          <div>
            <img src={result.albumImageUrl} alt={`${result.title} album art`} />
            {/* <SpotifyPlayingAnimation /> */}
            <a href={result.songUrl} target="_blank" rel="noopener noreferrer">
              {result.title}
            </a>
            <p>{result.artist}</p>
          </div>
        </div>
      )}
    </div>
  );
};
