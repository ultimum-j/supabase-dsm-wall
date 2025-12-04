'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clearSession, getSession } from '@/lib/session';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getSession());
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  const navLinks = isLoggedIn
    ? [
        { href: '/feed', label: 'Feed' },
        { href: '/upload', label: 'Upload' },
        { href: '/members', label: 'Members' },
        { href: '/profile', label: 'Profile' },
      ]
    : [];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Supabase DSM Wall
          </Link>

          {isLoggedIn && (
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium ${
                    pathname === link.href
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
