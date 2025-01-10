import ImageBackgroundComponentGooglePhotos from '@/Components/ImageBackgroundComponentGooglePhotos';
import { PropsWithChildren, ReactNode } from 'react';
function HaDashboardLayout({ children }: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <>
            {/* <ImageBackgroundComponent> */}
            <ImageBackgroundComponentGooglePhotos>
                <div className="relative">
                    <main>{children}</main>
                </div>
            </ImageBackgroundComponentGooglePhotos>
            {/* </ImageBackgroundComponent> */}
        </>
    );
}

export default HaDashboardLayout;
