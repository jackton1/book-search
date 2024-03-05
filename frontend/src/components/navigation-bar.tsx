"use client";
import UserProfile from "@/components/user-profile";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function NavigationBar() {
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

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <nav className="bg-gray-800 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
                <Link href="/">
                    <span className="text-xl font-semibold">BookSphere</span>
                </Link>
            </div>
            <UserProfile
                isDropdownOpen={isDropdownOpen}
                toggleDropdown={toggleDropdown}
            />
        </nav>
    );
}
