'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import StorageService from '@/app/services/storage';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
}

interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refreshPosts: () => void;
  getPostBySlug: (slug: string) => Post | null;
  savePost: (post: Post) => void;
  deletePost: (id: string) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Trong development, lấy từ localStorage
      if (process.env.NODE_ENV === 'development') {
        const storedPosts = StorageService.getPosts();
        setPosts(storedPosts);
        return;
      }

      // Trong production, lấy từ API
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const getPostBySlug = (slug: string): Post | null => {
    if (process.env.NODE_ENV === 'development') {
      return StorageService.getPostBySlug(slug);
    }
    return posts.find(post => post.slug === slug) || null;
  };

  const savePost = async (post: Post) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        StorageService.savePost(post);
        refreshPosts();
        return;
      }

      const response = await fetch('/api/posts', {
        method: post.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      refreshPosts();
    } catch (err) {
      console.error('Error saving post:', err);
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        StorageService.deletePost(id);
        refreshPosts();
        return;
      }

      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      refreshPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        error,
        refreshPosts,
        getPostBySlug,
        savePost,
        deletePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}