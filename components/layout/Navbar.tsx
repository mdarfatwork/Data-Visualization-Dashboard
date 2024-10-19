"use client"
import React from 'react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const { signOut, isSignedIn } = useAuth();
    const router = useRouter()

    const logOut = async () => {
        try {
            await signOut();
            router.push('/sign-in')
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };
    return (
        <header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <span className="ml-3 text-xl">Data Dashboard</span>
                </Link>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    {isSignedIn ? (
                        <>
                        <Link href="/dashboard" className="mr-5 hover:text-gray-900">Dashboard</Link>
                        <span onClick={logOut} className="mr-5 hover:text-gray-900 cursor-pointer">Log Out</span>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-up" className="mr-5 hover:text-gray-900">Sign Up</Link>
                            <Link href="/sign-in" className="mr-5 hover:text-gray-900">Sign In</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar;