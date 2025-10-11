import axios, { AxiosResponse } from 'axios';
import { PropsWithChildren, useEffect, useState } from 'react';

const isDevelopment = process.env.NODE_ENV === 'development';

interface RandomPhotoResponse extends AxiosResponse {
    data: {
        success: boolean;
        url: string;
        media_metadata_width: number;
    };
}

const DEFAULT_BACKGROUND_IMAGE = 'https://ucarecdn.com/05f649bf-b70b-4cf8-90f7-2588ce404a08/';

/**
 * ImageBackgroundComponent is a React component that displays a random background image from a predefined list.
 * It changes the background image every 10 minutes.
 *
 * @param {PropsWithChildren} props - The component props.
 * @returns {JSX.Element} The component JSX.
 */
export default function ImageBackgroundComponentGooglePhotos({ children }: PropsWithChildren) {
    const [currentBackground, setCurrentBackground] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const ignoreDevelopmentPhoto = false;

    const fetchRandomPhoto = async () => {
        try {
            if (isDevelopment && ignoreDevelopmentPhoto) {
                console.log('Using default image due to being in development mode');
                setCurrentBackground(DEFAULT_BACKGROUND_IMAGE);
                setError(false);
                return;
            }

            setError(false);

            // Try Google Photos first
            try {
                const response: RandomPhotoResponse = await axios.get('/api/random-photo-from-dashboard-album');
                if (response.status === 200 && response.data.success) {
                    setCurrentBackground(response.data.url);
                    setError(false);
                    setErrorMessage(null);
                    return;
                }
            } catch (googleErr) {
                console.log('Google Photos fetch failed, trying local photos...');
            }

            // If Google Photos fails, try local photos
            try {
                const localResponse: RandomPhotoResponse = await axios.get('/api/random-photo-local');
                if (localResponse.status === 200 && localResponse.data.success) {
                    console.log('Local photos fetch successful');
                    console.log(localResponse.data);
                    setCurrentBackground(localResponse.data.url);
                    setError(false);
                    setErrorMessage(null);
                    return;
                }
            } catch (localErr) {
                console.error('Local photos fetch failed:', localErr);
            }

            // If both fail, use default
            setCurrentBackground(DEFAULT_BACKGROUND_IMAGE);
            console.log('Failed to fetch photos from both Google Photos and local storage, using default background');
            setError(true);
            setErrorMessage('Failed to fetch photos from both Google Photos and local storage');
        } catch (err) {
            console.error('Failed to fetch photo:', err);
            setError(true);
            setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
            setCurrentBackground(DEFAULT_BACKGROUND_IMAGE);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomPhoto();
        const interval = setInterval(fetchRandomPhoto, 1000 * 60 * 10); // 10 minutes

        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div
                id="background-image-container"
                className="min-h-screen bg-gray-900"
                style={{
                    backgroundImage: `url(${new URL(currentBackground || DEFAULT_BACKGROUND_IMAGE).href})`,
                    // backgroundImage: `url(${currentBackground})`,
                    // backgroundImage: `url(${DEFAULT_BACKGROUND_IMAGE})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transition: 'background-image 1s ease-in-out',
                }}
            >
                {/* {error && <div className="text-muted-foreground">{errorMessage}</div>} */}
                <BackgroundGradient>{children}</BackgroundGradient>
            </div>
        </div>
    );
}

function BackgroundGradient({ children }: PropsWithChildren) {
    return (
        <div
            className=""
            style={{
                background: `
        linear-gradient(to bottom,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0) 20%,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, .2) 50%
        )
    `,
            }}
        >
            {children}
        </div>
    );
}
