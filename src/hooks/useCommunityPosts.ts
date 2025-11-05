import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  author_name: string;
  image_url?: string;
  likes: number;
  created_at: string;
}

export const useCommunityPosts = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial posts
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('community-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts',
        },
        (payload) => {
          console.log('Community post change:', payload);
          if (payload.eventType === 'INSERT') {
            setPosts((prev) => [payload.new as CommunityPost, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts((prev) =>
              prev.map((post) =>
                post.id === (payload.new as CommunityPost).id
                  ? (payload.new as CommunityPost)
                  : post
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter((post) => post.id !== (payload.old as CommunityPost).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { posts, loading };
};
