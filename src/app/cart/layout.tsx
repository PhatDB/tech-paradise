'use client';

import React from 'react'
import Footer from '@/components/shared/footer/Footer'
import Header from '@/components/shared/header/Index'
import GoogleProviderWrapper from '@/components/ui/GoogleProviderWrapper';
import {Provider} from 'react-redux';
import {store} from '@/store';

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <GoogleProviderWrapper>
                <div className='flex flex-col min-h-screen'>
                    <Header/>
                    <main className='flex-1 flex flex-col bg-gray-100'>{children}</main>
                    <Footer/>
                </div>
            </GoogleProviderWrapper>
        </Provider>
    )
}