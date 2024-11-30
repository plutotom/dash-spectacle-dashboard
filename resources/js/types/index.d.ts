export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};

export interface Event {
    id: string;
    name: string;
    startDateTime: string;
    endDateTime: string;
    description?: string;
}

export interface PageProps {
    flash: {
        success?: string;
        error?: string;
    };
}
