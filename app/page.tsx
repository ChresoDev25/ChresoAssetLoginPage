import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLogoutButton from '@/components/dashboard-logout-button';
import Image from 'next/image';
import {
  MousePointer2,
  Monitor,
  Laptop,
  Keyboard,
  Usb,
  NotebookPen
} from 'lucide-react';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fallback name if missing (or use email)
  const metadata = user.user_metadata as any;
  const userName = metadata?.full_name || metadata?.name || user.email || "User";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-hidden bg-[#0f172a]">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 bg-[#5c67f2] flex flex-col items-center py-6 px-4 lg:py-10 lg:px-6 relative z-20 shadow-xl shrink-0">
        {/* Logo Placeholder */}
        <div className="w-24 h-20 lg:w-40 lg:h-32 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 lg:mb-12 p-2 relative overflow-hidden">
          <Image
            src="/chreso-logo.png"
            alt="Chreso Logo"
            fill
            className="object-contain p-2"
            priority
          />
        </div>

        {/* Mouse Graphic (Center) - Hidden on Mobile to save space, or very small */}
        <div className="hidden lg:flex flex-1 items-center justify-center w-full relative">
          {/* Stylized Mouse Wire/Icon */}
          <div className="relative">
            <MousePointer2
              size={180}
              className="text-white opacity-80 rotate-12"
              strokeWidth={1}
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="w-full max-w-xs lg:max-w-none bg-white rounded-xl py-3 px-4 lg:py-4 lg:px-6 mb-6 lg:mb-8 text-center shadow-md">
          <span className="text-gray-900 font-bold uppercase tracking-wide truncate block text-sm lg:text-base">
            {userName}
          </span>
        </div>

        {/* Logout Section */}
        <DashboardLogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col p-6 lg:p-12 overflow-y-auto">
        {/* Header */}
        <header className="mb-10 lg:mb-20 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl tracking-wider text-white font-light text-opacity-90">
            CHRESO ASSET REGISTRY
          </h1>
        </header>

        {/* Action Buttons Area */}
        <div className="flex flex-col gap-8 lg:gap-16 mt-0 lg:mt-10 z-10 w-full max-w-md mx-auto lg:ml-10">
          <a
            href="https://asset-reg.vercel.app/"
            className="group relative"
          >
            <div className="bg-[#2d3780] hover:bg-[#384299] text-white text-lg lg:text-xl py-4 px-8 lg:py-6 lg:px-12 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center border border-white/10 active:scale-95">
              <span>QR GENERATOR</span>
            </div>
          </a>

          <a
            href="https://asset-reg-scanner.vercel.app/"
            className="group relative"
          >
            <div className="bg-[#2d3780] hover:bg-[#384299] text-white text-lg lg:text-xl py-4 px-8 lg:py-6 lg:px-12 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center border border-white/10 active:scale-95">
              <span>QR ASSET SCANNER</span>
            </div>
          </a>
        </div>

        {/* Background Illustrations - Hidden on Mobile */}
        <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Monitor - Top Center-Right */}
          <div className="absolute top-[10%] right-[30%] opacity-90 text-white transform -rotate-12">
            <Monitor size={220} strokeWidth={1.5} />
          </div>

          {/* Mouse for Monitor */}
          <div className="absolute top-[32%] right-[22%] opacity-90 text-white transform rotate-12">
            <MousePointer2 size={60} strokeWidth={1.5} />
          </div>

          {/* Laptop - Right Middle */}
          <div className="absolute top-[40%] right-[5%] opacity-90 text-white transform -rotate-12">
            <Laptop size={200} strokeWidth={1.5} />
          </div>

          {/* USB Drive - Left Middle (near buttons)*/}
          <div className="absolute top-[35%] left-[45%] opacity-90 text-white transform rotate-45">
            <Usb size={100} strokeWidth={1.5} />
          </div>

          {/* Keyboard part - Bottom Right */}
          <div className="absolute bottom-[10%] right-[15%] opacity-90 text-white transform -rotate-6">
            <Keyboard size={240} strokeWidth={1.5} />
          </div>

          {/* Notebook - Bottom Center */}
          <div className="absolute bottom-[15%] left-[40%] opacity-90 text-white transform rotate-6">
            <NotebookPen size={160} strokeWidth={1.5} />
          </div>

          {/* Moved Footer Text - Below Notebook */}
          <div className="absolute bottom-[5%] left-[40%] transform translate-x-[-10%] text-center z-10">
            <p className="text-white/80 text-sm italic tracking-widest font-semibold">
              &ldquo; Chreso Asset Registry System &rdquo;
            </p>
            <span className="text-white/60 text-xs normal-case not-italic mt-1 block">
              © DeZignBlu-Print ZM: 2026
            </span>
          </div>

          {/* Stylized wire for keyboard/mouse could be SVG paths, using simple positioning for "sketch" feel */}
        </div>

        {/* Mobile Footer (Visible only on small screens) */}
        <div className="lg:hidden mt-auto pt-10 pb-4 text-center z-10">
          <p className="text-white/80 text-sm italic tracking-widest font-semibold">
            &ldquo; Chreso Asset Registry System &rdquo;
          </p>
          <span className="text-white/60 text-xs normal-case not-italic mt-1 block">
            © DeZignBlu-Print ZM: 2026
          </span>
        </div>
      </main>
    </div>
  );
}
