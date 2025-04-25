'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaTachometerAlt, FaSignOutAlt, FaPlus, FaList, FaImage, FaLink, FaGift, FaNewspaper } from 'react-icons/fa';
import './admin.scss';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    setIsClient(true);
    
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
          // Chỉ chuyển hướng nếu không đang ở trang login và chưa chuyển hướng trước đó
          if (window.location.pathname !== '/admin/login') {
            console.log('Redirecting to login page');
            // Thêm một flag để tránh chuyển hướng nhiều lần
            if (!sessionStorage.getItem('redirecting')) {
              sessionStorage.setItem('redirecting', 'true');
              window.location.href = '/admin/login';
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Chỉ chuyển hướng nếu không đang ở trang login
        if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
    };

    checkAuth();
    
    // Xóa flag redirecting khi component unmount
    return () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('redirecting');
      }
    };
  }, [pathname]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    document.cookie = 'adminAuth=; path=/; max-age=0';
    window.location.href = '/admin/login';
  };

  // Nếu đang ở trang đăng nhập, chỉ hiển thị nội dung con
  if (pathname === '/admin/login' || !isClient) {
    return <>{children}</>;
  }

  // Nếu chưa đăng nhập, hiển thị trang loading
  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h1>92LOTTERY</h1>
          <p>Admin Panel</p>
        </div>
        
        <ul className="sidebar-menu">
          <li>
            <Link href="/admin/dashboard" className={pathname === '/admin/dashboard' ? 'active' : ''}>
              <FaTachometerAlt /> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/posts" className={pathname.startsWith('/admin/posts') ? 'active' : ''}>
              <FaNewspaper /> Bài viết
            </Link>
          </li>
          <li>
            <Link href="/admin/banners" className={pathname === '/admin/banners' ? 'active' : ''}>
              <FaImage /> Banners
            </Link>
          </li>
          <li>
            <Link href="/admin/icons" className={pathname === '/admin/icons' ? 'active' : ''}>
              <FaLink /> Icons
            </Link>
          </li>
          <li>
            <Link href="/admin/promotions" className={pathname === '/admin/promotions' ? 'active' : ''}>
              <FaGift /> Khuyến mãi
            </Link>
          </li>
        </ul>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Đăng xuất
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="admin-header">
          <div className="header-title">
            {pathname === '/admin/dashboard' && 'Dashboard'}
            {pathname === '/admin/posts' && 'Quản lý bài viết'}
            {pathname.startsWith('/admin/posts/new') && 'Thêm bài viết mới'}
            {pathname.startsWith('/admin/posts/edit') && 'Chỉnh sửa bài viết'}
            {pathname === '/admin/banners' && 'Quản lý banners'}
            {pathname === '/admin/icons' && 'Quản lý icons'}
            {pathname === '/admin/promotions' && 'Quản lý khuyến mãi'}
          </div>
          
          <div className="header-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Đăng xuất
            </button>
          </div>
        </div>
        
        <div className="admin-main">
          {children}
        </div>
      </div>
    </div>
  );
}
