import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

// Định nghĩa kiểu dữ liệu cho banner
interface Banner {
  id: number;
  title: string;
  image: string;
  link?: string;
  buttonText?: string;
  order: number;
  status: 'active' | 'inactive';
}

// Dữ liệu mẫu cho banners
const defaultBanners: Banner[] = [
  {
    id: 1,
    title: 'Khuyến mãi tháng 4',
    image: 'https://via.placeholder.com/1200x400/e60000/ffffff?text=Khuyến+mãi+tháng+4',
    link: '/promotions',
    buttonText: 'Xem ngay',
    order: 1,
    status: 'active'
  },
  {
    id: 2,
    title: 'Trò chơi mới',
    image: 'https://via.placeholder.com/1200x400/0066cc/ffffff?text=Trò+chơi+mới',
    link: '/games',
    buttonText: 'Chơi ngay',
    order: 2,
    status: 'active'
  },
  {
    id: 3,
    title: 'Thưởng nạp lần đầu',
    image: 'https://via.placeholder.com/1200x400/009933/ffffff?text=Thưởng+nạp+lần+đầu',
    link: '/bonus',
    buttonText: 'Nhận thưởng',
    order: 3,
    status: 'active'
  }
];

// Biến lưu trữ dữ liệu banners (trong môi trường production, bạn sẽ sử dụng database)
let banners: Banner[] = [...defaultBanners];

// GET /api/banners - Lấy tất cả banners
export async function GET() {
  try {
    // Trong môi trường production, bạn sẽ lấy dữ liệu từ database
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST /api/banners - Tạo banner mới
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Tạo banner mới với ID tự động
    const newBanner: Banner = {
      ...data,
      id: Date.now(),
    };
    
    // Thêm banner mới vào danh sách
    banners = [...banners, newBanner];
    
    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

// PUT /api/banners - Cập nhật danh sách banners
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Cập nhật toàn bộ danh sách banners
    banners = data;
    
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error updating banners:', error);
    return NextResponse.json(
      { error: 'Failed to update banners' },
      { status: 500 }
    );
  }
}

// DELETE /api/banners - Xóa tất cả banners
export async function DELETE() {
  try {
    // Xóa tất cả banners
    banners = [];
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting banners:', error);
    return NextResponse.json(
      { error: 'Failed to delete banners' },
      { status: 500 }
    );
  }
}
