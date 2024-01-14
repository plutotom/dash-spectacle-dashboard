import React, { useEffect, useState } from "react";

const GooglePhotosComponent: React.FC = () => {
  const [maxPhotoCount, setMaxPhotoCount] = useState<number>(25);
  const [photos, setPhotos] = useState<any[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");
  const [AuthorizationAttempt, setAuthorizationAttempt] = useState<number>(0);
  const [updateImage, setUpdateImage] = useState<number>(0);
  const [newImageIndex, setNewImageIndex] = useState<number>(
    Math.floor(Math.random() * maxPhotoCount),
  );

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
    const fetchPhotos = async () => {
      try {
        // POST
        const search = await fetch(
          "https://photoslibrary.googleapis.com/v1/mediaItems:search",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              pageSize: maxPhotoCount,
              filters: {
                contentFilter: {
                  includedContentCategories: ["PEOPLE", "SELFIES"],
                  excludedContentCategories: [
                    //? is limited to 10 items
                    // "ANIMALS",
                    // "FASHION",
                    // "LANDMARKS",
                    // "RECEIPTS",
                    // "FLOWERS",
                    // "LANDSCAPES",
                    "SCREENSHOTS",
                    // "WHITEBOARDS",
                    // "FOOD",
                    // "GARDENS",
                    // "SPORT",
                    // "CRAFTS",
                    // "PERFORMANCES",
                    "DOCUMENTS",
                    // "HOUSES",
                    // "PETS",
                    "UTILITY",
                  ],
                },
                mediaTypeFilter: {
                  mediaTypes: ["PHOTO"],
                },
                // includedFeatures: ["FAVORITES"],

                // dateFilter: {
                //   ranges: [
                //     {
                //       startDate: {
                //         year: 2014,
                //         month: 6,
                //         day: 12,
                //       },
                //       endDate: {
                //         year: 2014,
                //         month: 7,
                //         day: 13,
                //       },
                //     },
                //   ],
                // },
              },
            }),
          },
        );
        // Make an HTTP request to the Google Photos API endpoint
        const response = await fetch(
          "https://photoslibrary.googleapis.com/v1/mediaItems",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        // if (response.ok) {
        if (search.ok) {
          const data = await search.json();
          setMaxPhotoCount(data.mediaItems.length);
          setNewImageIndex(Math.floor(Math.random() * data.mediaItems.length));
          setPhotos(data.mediaItems);
        } else {
          console.error("Error fetching photos:", search.statusText);
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
    // }, [accessToken]);
  }, [accessToken, updateImage]);

  useEffect(() => {
    let updateImage = setInterval(
      () => setUpdateImage(Math.floor(Math.random() * maxPhotoCount)),
      // update every 4 hours
      // 1000 * 60 * 60 * 4
      // 10 sec
      100000,
    );
    return function cleanup() {
      clearInterval(updateImage);
    };
  });

  return (
    <div>
      {accessToken ? (
        photos.length > 0 ? (
          <ul>
            <li key={photos[newImageIndex]?.id}>
              <img
                src={photos[newImageIndex]?.baseUrl}
                alt={photos[newImageIndex]?.filename}
              />
            </li>
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
