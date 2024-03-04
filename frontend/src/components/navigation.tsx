"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react';
import { Session } from "next-auth";
import Link from "next/link";

export default function Navigation() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<Session['user'] | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const closeDropdown = (event: MouseEvent) => {
            if (isDropdownOpen && !(event.target as HTMLElement).closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, [isDropdownOpen]);

    useEffect(() => {
        if (session && status === 'authenticated') {
            setUser(session.user);
        }
    }, [session, status]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <nav className="bg-gray-800 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
                <Link href="/">
                    <span className="text-xl font-semibold">BookSphere</span>
                </Link>
            </div>
            {user && (
                <div className="flex items-center">
                    <span className="mr-4">{user.name || user.email}</span>
                    <div
                        className="relative dropdown-container"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown();
                        }}
                        style={{cursor: 'pointer'}}
                    >
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-semibold">
                            {getInitials(user?.name || '')}
                        </div>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                                <Link
                                    href="/api/auth/signout"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Sign out
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {status === 'loading' && <div>Loading...</div>}
        </nav>
    );
}
