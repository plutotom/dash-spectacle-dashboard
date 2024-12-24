import ImageBackgroundComponent from '@/Components/ImageBackgroundComponent';
import { PropsWithChildren, ReactNode } from 'react';

function HaDashboardLayout({ children }: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <>
            <ImageBackgroundComponent>
                <div className="absolute inset-0 bg-gray-900/50 dark:bg-gray-900/70" />

                <div className="relative">
                    <main>{children}</main>
                </div>
            </ImageBackgroundComponent>
        </>
    );
}

export default HaDashboardLayout;
