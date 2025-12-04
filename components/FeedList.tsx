'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Post, PublicUser } from '@/types/database';

type PostWithUser = Post & {
  user?: PublicUser;
};

export default function FeedList() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch users for each post
      const userIds = [...new Set(postsData?.map(p => p.user_id) || [])];
      const { data: usersData } = await supabase
        .from('users')
        .select('id, username, avatar_url')
        .in('id', userIds);

      const usersMap = new Map(usersData?.map(u => [u.id, u]) || []);
      
      const postsWithUsers = postsData?.map(post => ({
        ...post,
        user: usersMap.get(post.user_id),
      })) || [];

      setPosts(postsWithUsers);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading feed...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No posts yet. Be the first to share something!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* User info */}
          <div className="p-4 flex items-center gap-3">
            {post.user?.avatar_url ? (
              <img
                src={post.user.avatar_url}
                alt={post.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {post.user?.username?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium">{post.user?.username || 'Unknown'}</p>
              <p className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Content */}
          {post.type === 'photo' ? (
            <img
              src={post.file_url}
              alt="Post"
              className="w-full max-h-96 object-cover"
            />
          ) : (
            <div className="px-4 pb-2">
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm font-mono">📄 Code file</p>
                <a
                  href={post.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View file
                </a>
              </div>
            </div>
          )}

          {/* Caption */}
          {post.caption && (
            <div className="p-4">
              <p className="text-sm">{post.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
