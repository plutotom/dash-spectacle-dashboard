import { Head } from '@inertiajs/react';

interface Props {
    isConnected: boolean;
}

export default function Setup({ isConnected }: Props) {
    return (
        <>
            <Head title="Google Photos Setup" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {isConnected ? (
                                <div>
                                    <h3 className="text-lg font-medium text-green-600">✓ Connected to Google Photos</h3>
                                    <p className="mt-2 text-sm text-gray-600">Your account is successfully connected to Google Photos.</p>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Connect to Google Photos</h3>
                                    <p className="mt-2 text-sm text-gray-600">Connect your account to Google Photos to use your photos as background images.</p>
                                    <div className="mt-4">
                                        <a
                                            href={route('google.redirect')}
                                            className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700"
                                        >
                                            Connect Google Photos
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
