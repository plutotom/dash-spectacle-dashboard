import ImageBackgroundComponentGooglePhotos from '@/Components/ImageBackgroundComponentGooglePhotos';
import RemountingErrorBoundary from '@/Layouts/RemountingErrorBoundary';
import { PropsWithChildren, ReactNode } from 'react';
function HaDashboardLayout({ children }: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <>
            {/* <ImageBackgroundComponent> */}
            <RemountingErrorBoundary
                fallback={
                    <div className="relative">
                        <main>{children}</main>
                    </div>
                }
            >
                <ImageBackgroundComponentGooglePhotos>
                    <div className="relative">
                        <main>{children}</main>
                    </div>
                </ImageBackgroundComponentGooglePhotos>
            </RemountingErrorBoundary>
            {/* </ImageBackgroundComponent> */}
        </>
    );
}

export default HaDashboardLayout;
