import { useState, useEffect, useRef, useCallback } from 'react';
import { Post, Comment as CommentType } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Bookmark, Edit, Save, X } from 'lucide-react';
import CommentSection from './CommentSection';

type PostCardProps = {
  post: Post;
  onPostDeleted: (postId: string) => void;
  onPostUpdated?: (updatedPost: Post) => void;
};

export default function PostCard({ post, onPostDeleted, onPostUpdated }: PostCardProps) {
  // Log the post object to verify its structure
  useEffect(() => {
    console.log('PostCard - post:', post);
    console.log('PostCard - post.id:', post?.id);
  }, [post]);
  // Log the post object to verify its structure
  useEffect(() => {
    console.log('PostCard - post:', post);
    console.log('PostCard - post.id:', post?.id);
  }, [post]);
  const { profile } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Array<CommentType & { 
    profiles?: { 
      id: string; 
      name: string; 
      username: string; 
      avatar_url: string | null 
    };
    // For compatibility with CommentSection
    user?: {
      id: string;
      name: string;
      username: string;
      avatar_url: string | null;
    };
  }>>([]);
  const [commentCount, setCommentCount] = useState(post.comment_count || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content || '');
  const menuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Format date to relative time
  const formatTimeAgo = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  }, []);

  // Handle new comment
  const handleCommentAdded = useCallback(async () => {
    try {
      // Refresh the post to get updated comments
      const response = await api.get(`/api/posts/${post.id}`);
      const updatedPost = response.data;
      
      // Update comments and comment count
      setComments(updatedPost.comments || []);
      setCommentCount(updatedPost.comments?.length || 0);
      
      // Show comments section if it's not already shown
      if (!showComments) {
        setShowComments(true);
      }
    } catch (error) {
      console.error('Error refreshing comments:', error);
    }
  }, [post.id, showComments]);

  // Load comments when comments section is opened
  const loadComments = useCallback(async () => {
    try {
      console.log(`Loading comments for post ${post.id}...`);
      const response = await api.get(`/posts/${post.id}/comments`);
      
      // Log the response to help with debugging
      console.log('Comments API response:', response.data);
      
      // Map the comments to include user data in a format that matches our Comment interface
      const formattedComments = (response.data || []).map((comment: any) => {
        const userData = comment.profiles || {};
        return {
          ...comment,
          // For compatibility with the CommentSection component
          user: {
            id: comment.user_id,
            name: userData.name || 'Anonymous',
            username: userData.username || 'anonymous',
            avatar_url: userData.avatar_url || null
          }
        };
      });
      
      setComments(formattedComments);
      console.log(`Successfully loaded ${formattedComments.length} comments`);
    } catch (error) {
      console.error('Error loading comments:', {
        error,
        postId: post.id,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Set empty comments on error to prevent UI issues
      setComments([]);
    }
  }, [post.id]);

  // Check if current user has liked the post
  const checkIfLiked = useCallback(async () => {
    if (!profile?.id) return;
    
    try {
      const response = await api.get(`/posts/${post.id}/liked`);
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }, [post.id, profile?.id]);

  // Check if current user has saved the post
  const checkIfSaved = useCallback(async () => {
    if (!profile?.id) return;
    
    try {
      const response = await api.get(`/posts/${post.id}/saved`);
      setSaved(response.data.saved);
    } catch (error) {
      console.error('Error checking save status:', error);
    }
  }, [post.id, profile?.id]);

  // Generate share URL for the post
  const generateShareUrl = useCallback(() => {
    const baseUrl = window.location.origin;
    setShareUrl(`${baseUrl}/post/${post.id}`);
  }, [post.id]);

  // Handle like/unlike post
  const handleLike = useCallback(async () => {
    if (!profile) return;

    try {
      const response = await api.post(`/posts/${post.id}/${liked ? 'unlike' : 'like'}`);
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount || likeCount + (response.data.liked ? 1 : -1));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, [post.id, liked, likeCount, profile]);

  // Handle save/unsave post
  const handleSave = useCallback(async () => {
    if (!profile) return;

    try {
      const response = await api.post(`/posts/${post.id}/${saved ? 'unsave' : 'save'}`);
      setSaved(response.data.saved);
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  }, [post.id, saved, profile]);

  // Handle post deletion
  const handleDelete = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/api/posts/${post.id}`);
      onPostDeleted(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [post.id, onPostDeleted]);
  
  // Handle post editing
  const handleEdit = useCallback(() => {
    setEditedContent(post.content || '');
    setIsEditing(true);
    setShowMenu(false);
  }, [post.content]);
  
  // Save edited post
  const handleSaveEdit = useCallback(async () => {
    if (!editedContent.trim() || editedContent === post.content) {
      setIsEditing(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log(`Attempting to update post ${post.id}...`);
      // Try the first possible endpoint format
      try {
        console.log('Trying endpoint: /api/posts/' + post.id);
        const response = await api.put(`/api/posts/${post.id}`, { 
          content: editedContent 
        });
        console.log('Update successful with /api/posts/ endpoint');
        const updatedPost = response.data;
        if (onPostUpdated) {
          onPostUpdated(updatedPost);
        }
        setIsEditing(false);
        return;
      } catch (firstError) {
        console.log('First attempt failed, trying alternative endpoint...');
        // If first attempt fails, try the alternative endpoint format
        try {
          console.log('Trying alternative endpoint: /posts/' + post.id);
          const response = await api.put(`/posts/${post.id}`, { 
            content: editedContent 
          });
          console.log('Update successful with /posts/ endpoint');
          const updatedPost = response.data;
          if (onPostUpdated) {
            onPostUpdated(updatedPost);
          }
          setIsEditing(false);
          return;
        } catch (secondError) {
          console.error('Both endpoint attempts failed:');
          console.error('First error:', firstError);
          console.error('Second error:', secondError);
          throw secondError; // Re-throw to be caught by the outer catch
        }
      }
    } catch (error) {
      console.error('Error updating post:', error);
      let errorMessage = 'Failed to update post. ';
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        errorMessage += `Server responded with status ${error.response.status}: ${error.response.data?.message || 'No error details'}`;
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage += 'No response from server. Is the backend running?';
      } else {
        console.error('Error message:', error.message);
        errorMessage += error.message;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [editedContent, post.content, post.id, onPostUpdated]);
  
  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedContent(post.content || '');
  }, [post.content]);

  // Share post
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post',
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  }, [shareUrl]);

  // Initialize component
  useEffect(() => {
    checkIfLiked();
    checkIfSaved();
    generateShareUrl();
    
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [post.id, checkIfLiked, checkIfSaved, generateShareUrl]);
  
  // Auto-resize textarea when editing
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, editedContent]);

  // Load comments when comments section is opened
  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments, loadComments]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          {post.profiles?.avatar_url ? (
            <img
              src={post.profiles.avatar_url}
              alt={post.profiles.username || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                {post.profiles?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {post.profiles?.name || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-500">
              @{post.profiles?.username || 'user'} · {formatTimeAgo(post.created_at)}
            </p>
          </div>
        </div>

        {/* Three dots menu - Show for all posts for now (you can restrict later) */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              console.log('Profile ID:', profile?.id);
              console.log('Post User ID:', post.user_id);
              console.log('Match:', profile?.id === post.user_id);
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-full hover:bg-gray-100"
            disabled={loading}
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <button
                onClick={handleEdit}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {loading ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        {isEditing ? (
          <div>
            <textarea
              ref={textareaRef}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="What's on your mind?"
              disabled={loading}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center"
                disabled={loading || !editedContent.trim()}
              >
                {loading ? 'Saving...' : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
        )}
      </div>

      {post.image_url && (
        <div className="mb-4">
          <img
            src={post.image_url}
            alt="Post content"
            className="w-full rounded-lg object-cover max-h-[512px] cursor-pointer"
            onClick={() => {
              setShowComments(true);
              loadComments();
            }}
          />
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg ${
            liked ? 'text-red-500 hover:bg-red-50' : 'text-gray-500 hover:bg-gray-100'
          }`}
          disabled={loading}
        >
          <Heart className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <button
          onClick={() => {
            setShowComments(!showComments);
            if (!showComments) {
              loadComments();
            }
          }}
          className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg transition-colors ${
            showComments 
              ? 'bg-blue-50 text-blue-600' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            {showComments ? 'Hide Comments' : 'Add Comment'}
          </span>
          {commentCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {commentCount}
            </span>
          )}
        </button>

        <button
          onClick={handleShare}
          className="text-gray-500 hover:text-green-500"
        >
          <Share2 className="w-5 h-5" />
        </button>

        <button
          onClick={handleSave}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            saved ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">Save</span>
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        {post?.id ? (
          <CommentSection 
            postId={post.id} 
            comments={comments} 
            onCommentAdded={handleCommentAdded}
            isOpen={showComments}
          />
        ) : (
          <div className="text-red-500 text-sm p-2">
            Error: Post ID is missing. Please refresh the page.
          </div>
        )}
      </div>
    </div>
  );
}
