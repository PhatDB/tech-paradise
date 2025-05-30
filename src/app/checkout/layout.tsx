import React from 'react'
import Footer from '@/components/shared/footer/Footer'
import Header from '@/components/shared/header/Index'

export default async function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col min-h-screen'>
            <Header/>
            <main className='flex-1 flex flex-col bg-gray-100'>{children}</main>
            <Footer/>
        </div>
    )
}