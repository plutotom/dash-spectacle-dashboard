import { router } from '@inertiajs/react';
import React, { useState } from 'react';

interface Album {
    id: string;
    title: string;
    productUrl: string;
    mediaItemsCount: number;
    coverPhotoUrl: string;
}

interface UploadPhotosProps {
    albums: Album[];
    errors?: Record<string, string>;
    success?: string;
}

interface InertiaProgressEvent {
    percentage: number;
}

const UploadPhotos: React.FC<UploadPhotosProps> = ({ albums, errors, success }) => {
    console.log(albums);
    console.log(errors);
    console.log(success);
    const [albumId, setAlbumId] = useState(albums[0]?.id || '');
    const [files, setFiles] = useState<FileList | null>(null);
    const [progress, setProgress] = useState<number | null>(null);
    const [results, setResults] = useState<unknown>(null);

    // Album creation state
    const [newAlbumName, setNewAlbumName] = useState('');
    const [albumError, setAlbumError] = useState<string | null>(null);
    const [albumSuccess, setAlbumSuccess] = useState<string | null>(null);

    const handleCreateAlbum = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAlbumName.trim()) {
            setAlbumError('Album name is required');
            return;
        }
        setAlbumError(null);
        router.post(
            '/api/create-album',
            { name: newAlbumName },
            {
                onSuccess: () => {
                    setNewAlbumName('');
                    setAlbumSuccess('Album created! Reloading...');
                    setTimeout(() => window.location.reload(), 1000);
                },
                onError: (errors) => {
                    setAlbumError(errors?.name || 'Failed to create album');
                },
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!files || !albumId) {
            return;
        }

        const data = {
            albumId,
            photos: Array.from(files),
        };

        router.post('/api/upload-photos', data, {
            forceFormData: true,
            onProgress: (event: InertiaProgressEvent) => {
                setProgress(event.percentage);
            },
            onSuccess: (page: unknown) => {
                setResults((page as { props: { results: unknown } }).props.results);
                setProgress(null);
            },
            onError: () => {
                setProgress(null);
            },
        });
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8 p-6">
            {/* Album creation form */}
            <form onSubmit={handleCreateAlbum} className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="mb-2 text-lg font-semibold text-gray-800">Create a New Album</h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newAlbumName}
                        onChange={(e) => setNewAlbumName(e.target.value)}
                        placeholder="Album name"
                        className="flex-1 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Create Album
                    </button>
                </div>
                {albumError && <div className="mt-2 text-sm text-red-600">{albumError}</div>}
                {albumSuccess && <div className="mt-2 text-sm text-green-600">{albumSuccess}</div>}
                {errors?.album_error && <div className="mt-2 text-sm text-red-600">{errors.album_error}</div>}
                {success && <div className="mt-2 text-sm text-green-600">{success}</div>}
            </form>

            {/* Upload form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {errors &&
                    Object.values(errors).map((error) => (
                        <div key={error} className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
                            {error}
                        </div>
                    ))}
                {success && <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">{success}</div>}
                <h1 className="mb-6 text-2xl font-bold text-gray-800">Upload Photos to Google Photos</h1>

                <div className="space-y-2">
                    <label htmlFor="album-select" className="block text-sm font-medium text-gray-700">
                        Select Album:
                    </label>
                    <select
                        id="album-select"
                        name="album"
                        value={albumId}
                        onChange={(e) => setAlbumId(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                        {albums.map((album) => (
                            <option key={album.id} value={album.id}>
                                {album.title} ({album.mediaItemsCount || 0} items)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">
                        Select Photos:
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setFiles(e.target.files)}
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Upload
                </button>

                {progress !== null && (
                    <div className="space-y-2">
                        <progress value={progress} max={100} className="h-2 w-full rounded-full bg-gray-200">
                            {progress}%
                        </progress>
                        <span className="text-sm text-gray-600">{progress}%</span>
                    </div>
                )}

                {results && (
                    <div className="mt-6 rounded-lg bg-gray-50 p-4">
                        <h3 className="mb-2 text-lg font-medium text-gray-800">Upload Results</h3>
                        <pre className="overflow-x-auto text-sm text-gray-600">{JSON.stringify(results, null, 2)}</pre>
                    </div>
                )}
            </form>
        </div>
    );
};

export default UploadPhotos;
