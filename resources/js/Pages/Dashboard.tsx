import NavLink from '@/Components/NavLink';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>Welcome to spectral-dashboard v2</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">There are a few things you can do:</p>
                                    <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6 text-muted-foreground">
                                        <li>Go to the HA dashboard and send a message.</li>
                                        <li>Upload a picture to show up on the dashboard. Be nice.</li>
                                        <li>That’s kind of all for now.</li>
                                    </ul>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Button variant="default">
                                        {/* Replace with a real route if available */}

                                        <NavLink className="text-white" href={route('ha.dashboard')} active={route().current('ha.dashboard')}>
                                            Go to HA Dashboard
                                        </NavLink>
                                    </Button>
                                    <Button variant="secondary">
                                        {/* Replace with a real route if available */}
                                        <NavLink className="text-white" href={route('google-photos.upload')} active={route().current('google-photos.upload')}>
                                            Upload a Picture
                                        </NavLink>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-between">
                            <span className="text-xs text-muted-foreground">Have fun and keep it tidy.</span>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
