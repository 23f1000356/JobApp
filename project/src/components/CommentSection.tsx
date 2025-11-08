import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Comment as CommentType } from '../lib/supabase';
import api from '../lib/api';
import { Trash2, User } from 'lucide-react';

// Use the CommentType from supabase and extend it with the user profile
type Comment = Omit<CommentType, 'profiles'> & {
  profiles?: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
  };
  // Add user property for compatibility with the component
  user?: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
  };
};

type CommentSectionProps = {
  postId: string;
  comments: Comment[];
  onCommentAdded: () => void;
  isOpen: boolean;
};

export default function CommentSection({ postId, comments, onCommentAdded, isOpen }: CommentSectionProps) {
  console.log('CommentSection rendered with props:', { 
    postId, 
    commentsCount: comments?.length || 0, 
    isOpen,
    hasOnCommentAdded: !!onCommentAdded 
  });

  const { profile } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Log when postId changes
  useEffect(() => {
    console.log('CommentSection - postId changed:', postId);
    
    // This will help us see if the component is re-rendering with a different postId
    return () => {
      console.log('CommentSection unmounting with postId:', postId);
    };
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== Comment Submission Started ===');
    console.log('Post ID:', postId);
    console.log('Comment content:', content);
    
    if (!postId) {
      console.error('Post ID is missing in handleSubmit');
      console.log('Current component state:', { 
        postId, 
        commentsCount: comments?.length || 0,
        isOpen,
        hasOnCommentAdded: !!onCommentAdded
      });
      alert('Error: Unable to determine the post. Please refresh the page and try again.');
      return;
    }
    
    if (!profile) {
      console.error('No profile found. User may not be logged in.');
      alert('You need to be logged in to comment.');
      return;
    }
    
    if (!isOpen) {
      console.error('Comment section is not open');
      return;
    }
    
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      console.error('Comment content is empty');
      return;
    }
    
    setLoading(true);

    try {
      console.log('Submitting comment:', { postId, content: trimmedContent });
      const response = await api.post(`/posts/${postId}/comment`, {
        content: trimmedContent
      }, {
        withCredentials: true // Ensure cookies are sent with the request
      });
      
      console.log('Comment submitted successfully:', response.data);
      
      setContent('');
      onCommentAdded();
    } catch (error: any) {
      console.error('Error creating comment:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || 'Failed to add comment. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!postId) {
      console.error('Post ID is missing');
      alert('Error: Unable to determine the post. Please refresh the page and try again.');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    setDeletingId(commentId);
    
    try {
      // Note: You'll need to implement a backend endpoint for deleting comments
      // For now, we'll just refresh the comments
      await api.delete(`/api/comments/${commentId}`);
      onCommentAdded();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-3 min-h-[40px] max-h-32 resize-none"
                rows={1}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!content.trim() || loading}
                className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
              >
                {loading ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
            <div className="flex-shrink-0">
              {comment.user?.avatar_url ? (
                <img 
                  src={comment.user.avatar_url} 
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.user?.name || 'Anonymous'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(comment.created_at)}
                  </span>
                </div>
                {profile?.id === comment.user_id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    disabled={deletingId === comment.id}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-800 mt-0.5">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}
