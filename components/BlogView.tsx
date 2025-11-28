
import React, { useState, useRef } from 'react';
import { INITIAL_BLOG_POSTS } from '../constants';
import { BlogPost, Comment } from '../types';
import { Send, Heart, MessageSquare, Share2, User, Camera, Image as ImageIcon, X, ArrowLeft } from 'lucide-react';

interface BlogViewProps {
  onBack: () => void;
}

const BlogView: React.FC<BlogViewProps> = ({ onBack }) => {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [content, setContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Swipe to back logic
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50) onBack(); 
    touchStart.current = null;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setNewPostImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !newPostImage) return;

    const newPost: BlogPost = {
      id: Date.now().toString(),
      author: 'Guest User',
      content: content,
      timestamp: 'Just now',
      likes: 0,
      liked: false,
      comments: [],
      image: newPostImage || undefined
    };

    setPosts([newPost, ...posts]);
    setContent('');
    setNewPostImage(null);
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const input = commentInputs[postId];
    if (!input?.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'Guest User',
      content: input,
      timestamp: 'Just now'
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div 
      className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-safe-area border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 z-10 sticky top-0 transition-colors">
         <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition">
            <ArrowLeft size={24} />
         </button>
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Community</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32 md:pb-6">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Create Post */}
          <div className="bg-white dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-xl transition-colors">
            <h3 className="text-gray-900 dark:text-white font-bold mb-4">Share your experience</h3>
            <form onSubmit={handlePost} className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening at the mall?"
                className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-none transition-colors"
              />
              
              {/* Image Preview */}
              {newPostImage && (
                <div className="relative mt-3 w-full h-48 rounded-xl overflow-hidden group border border-gray-200 dark:border-white/10">
                  <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setNewPostImage(null)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 text-white p-1 rounded-full backdrop-blur transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-500 dark:text-gray-400 hover:text-primary transition p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    <Camera size={20} />
                  </button>
                </div>
                <button 
                  type="submit"
                  disabled={!content.trim() && !newPostImage}
                  className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary text-white px-5 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  Post <Send size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Feed */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Community Feed</h3>
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl p-5 animate-fade-in shadow-sm dark:shadow-none transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                     {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{post.author}</div>
                    <div className="text-xs text-gray-500">{post.timestamp}</div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed whitespace-pre-wrap text-sm">
                  {post.content}
                </p>

                {post.image && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 h-64 w-full">
                    <img src={post.image} alt="Post attachment" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex items-center gap-6 border-t border-gray-100 dark:border-white/5 pt-3">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 text-sm transition-colors group ${post.liked ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400 hover:text-pink-500'}`}
                  >
                    <Heart size={18} className={`transition-transform group-active:scale-125 ${post.liked ? 'fill-pink-500' : 'group-hover:fill-pink-500'}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-2 text-sm transition-colors ${expandedComments.has(post.id) ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <MessageSquare size={18} />
                    <span>{post.comments.length > 0 ? post.comments.length : ''} Comments</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ml-auto">
                    <Share2 size={18} />
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments.has(post.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 space-y-4 animate-fade-in">
                    {/* List Comments */}
                    {post.comments.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {post.comments.map(comment => (
                          <div key={comment.id} className="flex gap-3 text-sm">
                             <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 shrink-0">
                                {comment.author.charAt(0)}
                             </div>
                             <div className="flex-1 bg-gray-100 dark:bg-white/5 rounded-lg rounded-tl-none p-2 px-3">
                               <div className="flex justify-between items-baseline mb-1">
                                 <span className="font-bold text-gray-700 dark:text-gray-300 text-xs">{comment.author}</span>
                                 <span className="text-[10px] text-gray-500">{comment.timestamp}</span>
                               </div>
                               <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm py-2">No comments yet. Be the first!</div>
                    )}

                    {/* Add Comment */}
                    <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="flex-1 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      />
                      <button 
                        type="submit"
                        disabled={!commentInputs[post.id]?.trim()}
                        className="bg-primary disabled:opacity-50 text-white p-2 rounded-lg hover:bg-primary-hover transition"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
