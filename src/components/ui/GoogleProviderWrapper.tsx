'use client';

import {GoogleOAuthProvider} from '@react-oauth/google';
import React, {ReactNode} from 'react';

export default function GoogleProviderWrapper({children}: { children: ReactNode }) {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            {children}
        </GoogleOAuthProvider>
    );
}
