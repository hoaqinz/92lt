'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaTachometerAlt, FaSignOutAlt, FaPlus, FaList, FaImage, FaLink, FaGift } from 'react-icons/fa';
import './admin.scss';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    // Bỏ qua kiểm tra nếu đang ở trang đăng nhập
    if (pathname === '/admin/login') {
      return;
    }

    // Kiểm tra xem người dùng đã đăng nhập chưa
    const checkAuth = () => {
      try {
        // Sử dụng window để đảm bảo chỉ chạy ở client-side
        if (typeof window !== 'undefined') {
          const authData = localStorage.getItem('adminAuth');
          console.log('Auth data from localStorage:', authData ? 'Found' : 'Not found');

          if (authData) {
            const parsedData = JSON.parse(authData);
            console.log('Parsed auth data:', parsedData);

            const { isLoggedIn, timestamp } = parsedData;

            // Kiểm tra thời gian hết hạn (24 giờ)
            const now = new Date().getTime();
            const expirationTime = 24 * 60 * 60 * 1000; // 24 giờ tính bằng mili giây

            if (isLoggedIn && now - timestamp < expirationTime) {
              console.log('Auth valid, setting logged in state');
              setIsLoggedIn(true);

              // Cập nhật cookie để đồng bộ với middleware
              document.cookie = `adminAuth=${authData}; path=/; max-age=${expirationTime / 1000}`;
              return;
            } else {
              console.log('Auth expired or invalid');
            }
          }

          // Nếu không đăng nhập hoặc đã hết hạn, chuyển hướng đến trang đăng nhập
          console.log('Redirecting to login page');
          window.location.href = '/admin/login';
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
    };

    checkAuth();
  }, [pathname]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('adminAuth');
    document.cookie = 'adminAuth=; path=/; max-age=0';

    // Sử dụng window.location thay vì router để đảm bảo chuyển hướng hoạt động
    window.location.href = '/admin/login';
  };

  // Nếu đang ở trang đăng nhập, chỉ hiển thị nội dung con
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Nếu chưa đăng nhập và không phải trang đăng nhập, hiển thị loading
  if (!isLoggedIn) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  // Hiển thị layout admin khi đã đăng nhập
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h1>92LOTTERY</h1>
          <p>Admin Panel</p>
        </div>

        <nav className="admin-nav">
          <ul>
            <li>
              <Link href="/admin/dashboard" className={pathname === '/admin/dashboard' ? 'active' : ''}>
                <FaTachometerAlt /> Dashboard
              </Link>
            </li>
            <li className="nav-section-title">Bài viết</li>
            <li>
              <Link href="/admin/posts" className={pathname === '/admin/posts' ? 'active' : ''}>
                <FaList /> Danh sách bài viết
              </Link>
            </li>
            <li>
              <Link href="/admin/posts/new" className={pathname === '/admin/posts/new' ? 'active' : ''}>
                <FaPlus /> Thêm bài viết mới
              </Link>
            </li>
            <li className="nav-section-title">Giao diện</li>
            <li>
              <Link href="/admin/banners" className={pathname === '/admin/banners' ? 'active' : ''}>
                <FaImage /> Quản lý banner
              </Link>
            </li>
            <li>
              <Link href="/admin/icons" className={pathname === '/admin/icons' ? 'active' : ''}>
                <FaLink /> Quản lý icon & liên kết
              </Link>
            </li>
            <li>
              <Link href="/admin/promotions" className={pathname === '/admin/promotions' ? 'active' : ''}>
                <FaGift /> Quản lý khuyến mãi
              </Link>
            </li>
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> Đăng xuất
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h2>
            {pathname === '/admin/dashboard' && 'Dashboard'}
            {pathname === '/admin/posts' && 'Quản lý bài viết'}
            {pathname === '/admin/posts/new' && 'Thêm bài viết mới'}
            {pathname.startsWith('/admin/posts/edit/') && 'Chỉnh sửa bài viết'}
            {pathname === '/admin/banners' && 'Quản lý banner'}
            {pathname === '/admin/icons' && 'Quản lý icon & liên kết'}
            {pathname === '/admin/promotions' && 'Quản lý khuyến mãi'}
          </h2>
        </header>

        <div className="admin-main-content">
          {children}
        </div>
      </main>
    </div>
  );
}
