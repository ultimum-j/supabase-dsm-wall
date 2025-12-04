import FeedList from '@/components/FeedList';
import Navigation from '@/components/Navigation';

export default function FeedPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Community Feed</h1>
        <FeedList />
      </main>
    </div>
  );
}
