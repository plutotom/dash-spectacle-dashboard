import ImageBackgroundComponent from '@/Components/ImageBackgroundComponent';
import { PropsWithChildren, ReactNode } from 'react';

function HaDashboardLayout({ children }: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <>
            <ImageBackgroundComponent>
                <div className="relative">
                    <main>{children}</main>
                </div>
            </ImageBackgroundComponent>
        </>
    );
}

export default HaDashboardLayout;
