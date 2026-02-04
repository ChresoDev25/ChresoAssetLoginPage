import LoginForm from '@/components/login-form';
import Image from 'next/image';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#0f172a]">
            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
                    <Image
                        src="/chreso-logo2.png"
                        alt="Chreso University Logo"
                        width={100}
                        height={100}
                        className="mb-2 object-contain"
                    />
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
                        Chreso University IT
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-300">
                        Sign in to your account
                    </p>
                </div>

                <LoginForm />
            </main>

            {/* Footer */}
            <footer className="w-full py-6 text-center bg-[#1e293b]/50 border-t border-white/10 backdrop-blur-sm">
                <p className="text-white/80 text-sm italic tracking-widest font-semibold">
                    &ldquo; Chreso Asset Registry System &rdquo;
                </p>
                <span className="text-white/60 text-xs normal-case not-italic mt-1 block">
                    © DeZignBlu-Print ZM: 2026
                </span>
            </footer>
        </div>
    );
}
