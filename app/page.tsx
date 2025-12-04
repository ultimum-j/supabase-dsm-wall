import AuthForm from '@/components/AuthForm';
import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Supabase DSM Wall
          </h1>
          <p className="text-lg text-gray-600">
            A community platform for the Des Moines Supabase Meetup
          </p>
        </div>
        <AuthForm />
      </main>
    </div>
  );
}
