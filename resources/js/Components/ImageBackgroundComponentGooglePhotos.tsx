import axios, { AxiosResponse } from 'axios';
import { PropsWithChildren, useState } from 'react';

import { useEffect } from 'react';
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

    const fetchRandomPhoto = async () => {
        try {
            // returns {success: true, url: string}
            if (isDevelopment) {
                setCurrentBackground(DEFAULT_BACKGROUND_IMAGE);
                setError(false);
                return;
            }
            setError(false);
            const response: RandomPhotoResponse = await axios.get('/api/random-photo-from-dashboard-album');
            if (response.status === 200) {
                setCurrentBackground(response.data.url);
                setError(false);
                setErrorMessage(null);
            }
        } catch (err) {
            console.error('Failed to fetch photo:', err);
            setError(true);
            setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
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
                className="min-h-screen bg-gray-900"
                style={{
                    backgroundImage: `url(${currentBackground})`,
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
