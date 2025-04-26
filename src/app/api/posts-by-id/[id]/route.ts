import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

// Hàm này cần thiết cho static export với dynamic routes
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

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

// API endpoint để lấy bài viết theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const posts = readPostsData();
    const post = posts.find(p => p.id === id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// API endpoint để cập nhật bài viết theo ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updatedPost = await request.json();

    // Đọc dữ liệu hiện tại
    const posts = readPostsData();

    // Tìm và cập nhật bài viết
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Cập nhật thời gian
    updatedPost.updatedAt = new Date().toISOString();
    updatedPost.id = id; // Đảm bảo ID không bị thay đổi

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

// API endpoint để xóa bài viết theo ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Đọc dữ liệu hiện tại
    const posts = readPostsData();

    // Lọc bỏ bài viết cần xóa
    const updatedPosts = posts.filter(post => post.id !== id);

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
