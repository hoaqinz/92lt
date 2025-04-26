import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

// Hàm này cần thiết cho static export với dynamic routes
export function generateStaticParams() {
  return [
    { slug: 'huong-dan-choi-win-go' },
    { slug: 'top-10-game-slots' },
    { slug: 'bai-viet-1' },
    { slug: 'bai-viet-2' },
    { slug: 'bai-viet-3' },
    { slug: 'bai-viet-4' },
    { slug: 'bai-viet-5' },
    { slug: 'bai-viet-moi-nhat' },
    { slug: 'huong-dan-su-dung' },
    { slug: 'gioi-thieu' },
    { slug: 'lien-he' },
    { slug: 'chinh-sach-bao-mat' },
    { slug: 'dieu-khoan-su-dung' },
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

// Dữ liệu mẫu cho các bài viết
const samplePosts: Post[] = [
  {
    id: 1,
    title: 'Hướng dẫn cách chơi Win Go hiệu quả nhất',
    slug: 'huong-dan-choi-win-go',
    content: '<p>Win Go là một trong những trò chơi xổ số phổ biến nhất tại 92LOTTERY...</p>',
    excerpt: 'Tìm hiểu các chiến thuật và mẹo chơi Win Go để tăng cơ hội chiến thắng của bạn.',
    featuredImage: 'https://dummyimage.com/1200x600/1a1a1a/ff0000.png&text=Win+Go+Guide',
    category: 'Hướng dẫn',
    author: 'Admin',
    createdAt: '2023-07-15T00:00:00Z',
    updatedAt: '2023-07-15T00:00:00Z',
    status: 'published'
  },
  {
    id: 2,
    title: 'Top 10 game Slots được yêu thích nhất tháng 7/2023',
    slug: 'top-10-game-slots',
    content: '<p>Slots là một trong những thể loại game casino phổ biến nhất tại 92LOTTERY...</p>',
    excerpt: 'Khám phá những game Slots hot nhất và được người chơi yêu thích trong tháng này.',
    featuredImage: 'https://dummyimage.com/1200x600/1a1a1a/ffcc00.png&text=Top+Slots',
    category: 'Tin tức',
    author: 'Admin',
    createdAt: '2023-07-10T00:00:00Z',
    updatedAt: '2023-07-10T00:00:00Z',
    status: 'published'
  },
  {
    id: 3,
    title: 'Bài viết 1',
    slug: 'bai-viet-1',
    content: '<p>Nội dung bài viết 1...</p>',
    excerpt: 'Tóm tắt bài viết 1',
    featuredImage: 'https://dummyimage.com/1200x600/1a1a1a/ff0000.png&text=Bai+Viet+1',
    category: 'Tin tức',
    author: 'Admin',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: '2023-08-01T00:00:00Z',
    status: 'published'
  },
  {
    id: 4,
    title: 'Bài viết 2',
    slug: 'bai-viet-2',
    content: '<p>Nội dung bài viết 2...</p>',
    excerpt: 'Tóm tắt bài viết 2',
    featuredImage: 'https://dummyimage.com/1200x600/1a1a1a/ff0000.png&text=Bai+Viet+2',
    category: 'Hướng dẫn',
    author: 'Admin',
    createdAt: '2023-08-02T00:00:00Z',
    updatedAt: '2023-08-02T00:00:00Z',
    status: 'published'
  },
  {
    id: 5,
    title: 'Bài viết 3',
    slug: 'bai-viet-3',
    content: '<p>Nội dung bài viết 3...</p>',
    excerpt: 'Tóm tắt bài viết 3',
    featuredImage: 'https://dummyimage.com/1200x600/1a1a1a/ff0000.png&text=Bai+Viet+3',
    category: 'Khuyến mãi',
    author: 'Admin',
    createdAt: '2023-08-03T00:00:00Z',
    updatedAt: '2023-08-03T00:00:00Z',
    status: 'published'
  }
];

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
    // Nếu file không tồn tại, tạo file mới với dữ liệu mẫu
    fs.writeFileSync(dataFilePath, JSON.stringify(samplePosts, null, 2));
    return samplePosts;
  }

  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

// API endpoint để lấy bài viết theo slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const posts = readPostsData();
    const post = posts.find(p => p.slug === slug);

    if (!post) {
      // Nếu không tìm thấy bài viết, tìm trong dữ liệu mẫu
      const samplePost = samplePosts.find(p => p.slug === slug);
      
      if (samplePost) {
        return NextResponse.json(samplePost);
      }
      
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
