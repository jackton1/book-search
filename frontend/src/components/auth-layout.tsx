import React from "react";

const AuthLayout = ({children}: { children: React.ReactNode }) => (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-200">
        <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
            {children}
        </div>
    </div>
);

export default AuthLayout;
