import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Supabase DSM Wall',
  description: 'Des Moines Supabase Meetup - Community Wall',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
