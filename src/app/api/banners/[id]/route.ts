import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

// Hàm này cần thiết cho static export với dynamic routes
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

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

// Dữ liệu mẫu cho banners (trong môi trường production, bạn sẽ sử dụng database)
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

// Biến lưu trữ dữ liệu banners
let banners: Banner[] = [...defaultBanners];

// GET /api/banners/[id] - Lấy banner theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const banner = banners.find(b => b.id === id);
    
    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banner' },
      { status: 500 }
    );
  }
}

// PUT /api/banners/[id] - Cập nhật banner theo ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    
    // Tìm index của banner cần cập nhật
    const index = banners.findIndex(b => b.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }
    
    // Cập nhật banner
    const updatedBanner = {
      ...banners[index],
      ...data,
      id // Đảm bảo ID không bị thay đổi
    };
    
    banners[index] = updatedBanner;
    
    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

// DELETE /api/banners/[id] - Xóa banner theo ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Tìm index của banner cần xóa
    const index = banners.findIndex(b => b.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }
    
    // Xóa banner
    banners.splice(index, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
