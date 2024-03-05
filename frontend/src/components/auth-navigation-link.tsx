import Link from "next/link";

const AuthNavigationLink = ({ message, href, linkText, postMessage }: { message: string; href: string; linkText: string, postMessage?: string }) => (
    <div className="text-center text-sm text-gray-600">
        {message}{' '}
        <Link href={href} className="font-semibold text-gray-800 hover:underline">
            {linkText}
        </Link>
        {postMessage ? ` ${postMessage}` : ''}
    </div>
);

export default AuthNavigationLink;
