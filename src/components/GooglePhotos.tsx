import React, { useEffect, useState } from "react";

const GooglePhotosComponent: React.FC = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");
  const [AuthorizationAttempt, setAuthorizationAttempt] = useState<number>(0);

  // Parse the access token from the URL fragment
  const parseAccessToken = () => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hashParams.get("access_token");

    if (accessToken) {
      setAccessToken(accessToken);
      // Remove the access token from the URL fragment
      window.location.hash = "";
    } else {
      authorize();
    }
  };
  const authorize = () => {
    // Replace with your OAuth 2.0 client ID
    const clientId = process.env.REACT_APP_GOOGLE_PHOTO_API_CLIENT_ID;
    // Replace with the redirect URI registered in the Google API Console
    const redirectUri = "http://localhost:3000";
    // Construct the authorization URL
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=https://www.googleapis.com/auth/photoslibrary.readonly`;
    // Redirect the user to the authorization URL
    window.location.href = authUrl;
    setAuthorizationAttempt(AuthorizationAttempt + 1);

    // so we do not get stuck looping between auth page.
    if (AuthorizationAttempt > 5) {
      return <p>Authorization Failed</p>;
    } else {
      parseAccessToken();
    }
  };

  useEffect(() => {
    // Call the function to initiate the authorization flow
    // if (!accessToken) {
    //   authorize();
    //   parseAccessToken();
    // }
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        // Make an HTTP request to the Google Photos API endpoint
        const response = await fetch(
          "https://photoslibrary.googleapis.com/v1/mediaItems",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPhotos(data.mediaItems);
        } else {
          console.error("Error fetching photos:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    if (accessToken) {
      fetchPhotos();
    } else {
      parseAccessToken();
    }
  }, [accessToken]);

  return (
    <div>
      <h1>Google Photos Component</h1>
      {/* <button onClick={authorize}>Authorize</button> */}
      {accessToken ? (
        photos.length > 0 ? (
          <ul>
            <li key={photos[0].id}>
              <img src={photos[0].baseUrl} alt={photos[0].filename} />
            </li>

            {/* {photos.map((photo) => ( */}
            {/* <p>{photo.filename}</p> */}
            {/* ))} */}
          </ul>
        ) : (
          <p>No photos found.</p>
        )
      ) : (
        <p>Authorizing...</p>
      )}
    </div>
  );
};

export default GooglePhotosComponent;
