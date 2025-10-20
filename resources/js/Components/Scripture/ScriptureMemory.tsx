import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function ScriptureMemory({ children }: { children: ReactNode }) {
    return (
        <Card className="h-full w-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Scripture Memory</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
