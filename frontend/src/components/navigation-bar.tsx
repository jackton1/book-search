"use client";
import UserProfile from "@/components/user-profile";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function NavigationBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as HTMLElement).closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [isDropdownOpen]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-3">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Booksphere Logo"
            width={50}
            height={37}
            priority
          />
          <span className="text-xl font-semibold hidden sm:block">BookSphere</span>
        </Link>
      </div>
      <UserProfile
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
      />
      <style jsx global>{`
          body {
              font-family: 'Arial', sans-serif;
          }

          nav a:hover {
              text-decoration: underline;
          }

          .user-profile:hover {
              border-color: rgba(255, 255, 255, 0.6);
          }
      `}</style>
    </nav>
  );
}
