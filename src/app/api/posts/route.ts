import { NextRequest, NextResponse } from 'next/server';
import { createSlug } from '@/app/utils/helpers';

export const dynamic = 'force-static';

// GET /api/posts - Lấy tất cả bài viết
export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Tạo bài viết mới
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, content, category } = data;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content and category are required' },
        { status: 400 }
      );
    }

    // Tạo slug từ title
    const slug = createSlug(title);
    
    // Thêm các trường tự động
    const post = {
      ...data,
      slug,
      author: 'Admin', // TODO: Lấy từ session
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    const newPost = await response.json();
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Cập nhật bài viết
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Cập nhật thời gian
    const post = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error('Failed to update post');
    }

    const updatedPost = await response.json();
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Xóa bài viết
export async function DELETE(request: NextRequest) {
  try {
    // Lấy ID từ URL
    const id = request.url.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
