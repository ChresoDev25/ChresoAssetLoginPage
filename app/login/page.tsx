import LoginForm from '@/components/login-form';
import Image from 'next/image';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f172a] py-12 sm:px-6 lg:px-8">
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
        </div>
    );
}
