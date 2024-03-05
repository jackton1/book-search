import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const UserProfile = ({ toggleDropdown, isDropdownOpen }: { toggleDropdown: () => void, isDropdownOpen: boolean }) => {
  const { data: session, status, update } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {session && session.user && (
        <div className="flex items-center">
          <span className="mr-4">{session.user.name || session.user.email}</span>
          <div
            className="relative dropdown-container"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
            style={{cursor: 'pointer'}}
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-semibold">
              {getInitials(session.user?.name || '')}
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                <Link
                  href="/logout"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile;
