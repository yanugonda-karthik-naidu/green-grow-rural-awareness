import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export const usePostInteractions = (postId: string) => {
  const [likes, setLikes] = useState<any[]>([]);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Fetch current user once
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      setInitialized(true);
    };
    getUser();
  }, []);

  // Fetch interactions and subscribe to realtime
  useEffect(() => {
    if (!initialized) return;

    const fetchInteractions = async () => {
      // Fetch likes
      const { data: likesData } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId);

      if (likesData) {
        setLikes(likesData);
        setHasLiked(likesData.some(like => like.user_id === currentUserId));
      }

      // Fetch comments
      const { data: commentsData } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsData) {
        setComments(commentsData);
      }
    };

    fetchInteractions();

    // Subscribe to realtime updates
    const likesChannel = supabase
      .channel(`post-likes-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLikes(prev => {
              if (prev.some(l => l.id === (payload.new as any).id)) return prev;
              return [...prev, payload.new];
            });
            if ((payload.new as any).user_id === currentUserId) setHasLiked(true);
          } else if (payload.eventType === 'DELETE') {
            setLikes(prev => prev.filter(like => like.id !== (payload.old as any).id));
            if ((payload.old as any).user_id === currentUserId) setHasLiked(false);
          }
        }
      )
      .subscribe();

    const commentsChannel = supabase
      .channel(`post-comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments(prev => {
              if (prev.some(c => c.id === (payload.new as PostComment).id)) return prev;
              return [...prev, payload.new as PostComment];
            });
          } else if (payload.eventType === 'DELETE') {
            setComments(prev => prev.filter(comment => comment.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, [postId, currentUserId, initialized]);

  const toggleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }

    if (hasLiked) {
      // Unlike
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) {
        toast.error("Failed to unlike");
      }
    } else {
      // Like
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.error("You've already liked this post");
        } else {
          toast.error("Failed to like");
        }
      }
    }
  };

  const addComment = async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();

    const authorName = profile?.display_name || user.email?.split('@')[0] || 'Anonymous';

    const { error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        author_name: authorName,
        content
      });

    if (error) {
      toast.error("Failed to add comment");
    } else {
      toast.success("Comment added!");
    }
  };

  return {
    likes,
    comments,
    hasLiked,
    likesCount: likes.length,
    commentsCount: comments.length,
    toggleLike,
    addComment
  };
};
