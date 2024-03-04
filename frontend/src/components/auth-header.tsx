import Image from "next/image";

const AuthHeader = ({ title, subtitle, introText }: { title: string; subtitle: string; introText: string }) => (
    <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Image
            className="relative"
            src="/logo.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
        />
        <p className="text-lg text-gray-500">{subtitle}</p>
        <p className="text-sm text-gray-500">{introText}</p>
    </div>
);

export default AuthHeader;
