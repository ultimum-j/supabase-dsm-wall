'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { PublicUser } from '@/types/database';

export default function MemberList() {
  const [members, setMembers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, bio, avatar_url, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error('Error loading members:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading members...</div>;
  }

  if (members.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No members yet. Be the first to join!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <div key={member.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center text-center">
            {member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt={member.username}
                className="w-20 h-20 rounded-full object-cover mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mb-3">
                <span className="text-2xl text-gray-600 font-medium">
                  {member.username[0].toUpperCase()}
                </span>
              </div>
            )}
            
            <h3 className="font-medium text-lg">{member.username}</h3>
            
            {member.bio && (
              <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
            )}
            
            <p className="text-xs text-gray-400 mt-3">
              Joined {new Date(member.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
