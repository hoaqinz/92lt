import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

// Định nghĩa kiểu dữ liệu cho bài viết
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
}

// Đường dẫn đến file JSON lưu trữ dữ liệu
const dataFilePath = path.join(process.cwd(), 'data', 'posts.json');

// Đảm bảo thư mục data tồn tại
const ensureDataDirectoryExists = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Đọc dữ liệu từ file
const readPostsData = (): Post[] => {
  ensureDataDirectoryExists();
  
  if (!fs.existsSync(dataFilePath)) {
    // Nếu file không tồn tại, tạo file mới với mảng rỗng
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
    return [];
  }
  
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

// Ghi dữ liệu vào file
const writePostsData = (data: Post[]) => {
  ensureDataDirectoryExists();
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// API endpoint để lấy tất cả bài viết
export async function GET() {
  try {
    const posts = readPostsData();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error reading posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// API endpoint để tạo bài viết mới
export async function POST(request: NextRequest) {
  try {
    const newPost = await request.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!newPost.title || !newPost.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Đọc dữ liệu hiện tại
    const posts = readPostsData();
    
    // Thêm ID và timestamp nếu chưa có
    if (!newPost.id) {
      newPost.id = Date.now();
    }
    if (!newPost.createdAt) {
      newPost.createdAt = new Date().toISOString();
    }
    newPost.updatedAt = new Date().toISOString();
    
    // Thêm bài viết mới vào đầu mảng
    const updatedPosts = [newPost, ...posts];
    
    // Lưu dữ liệu
    writePostsData(updatedPosts);
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// API endpoint để cập nhật bài viết
export async function PUT(request: NextRequest) {
  try {
    const updatedPost = await request.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!updatedPost.id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Đọc dữ liệu hiện tại
    const posts = readPostsData();
    
    // Tìm và cập nhật bài viết
    const postIndex = posts.findIndex(post => post.id === updatedPost.id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Cập nhật thời gian
    updatedPost.updatedAt = new Date().toISOString();
    
    // Cập nhật bài viết
    posts[postIndex] = updatedPost;
    
    // Lưu dữ liệu
    writePostsData(posts);
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// API endpoint để xóa bài viết
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Đọc dữ liệu hiện tại
    const posts = readPostsData();
    
    // Lọc bỏ bài viết cần xóa
    const updatedPosts = posts.filter(post => post.id !== Number(id));
    
    // Kiểm tra xem có bài viết nào bị xóa không
    if (updatedPosts.length === posts.length) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Lưu dữ liệu
    writePostsData(updatedPosts);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
