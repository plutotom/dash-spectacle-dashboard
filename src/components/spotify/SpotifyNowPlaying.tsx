import { useEffect, useState } from "react";
import getNowPlayingItem from "../../shared/api/spotifyAPI";
// import SpotifyLogo from "./SpotifyLogo";
// import SpotifyPlayingAnimation from "./SpotifyPlayingAnimation";

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

export const SpotifyNowPlaying: React.FC<SpotifyNowPlayingProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<SpotifyResult | null>(null);

  useEffect(() => {
    Promise.all([
      getNowPlayingItem(
        props.client_id,
        props.client_secret,
        props.refresh_token
      ),
    ]).then((results) => {
      console.log(results);
      setResult(results[0] || null);
      setLoading(false);
    });
  }, []);

  const isPlaying = result?.title && result?.artist;

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && !isPlaying && (
        <div>
          {/* <SpotifyLogo /> */}
          <span>Currently offline</span>
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
