import UploadForm from '@/components/UploadForm';
import Navigation from '@/components/Navigation';

export default function UploadPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Content</h1>
        <UploadForm />
      </main>
    </div>
  );
}
