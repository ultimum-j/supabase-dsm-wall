import ProfileForm from '@/components/ProfileForm';
import Navigation from '@/components/Navigation';

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Profile</h1>
        <ProfileForm />
      </main>
    </div>
  );
}
