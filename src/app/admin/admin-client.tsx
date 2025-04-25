'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaTachometerAlt, FaSignOutAlt, FaPlus, FaList, FaImage, FaLink, FaGift, FaNewspaper } from 'react-icons/fa';

export default function AdminClient({
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

    // Xử lý các lỗi 404
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      // Kiểm tra nếu yêu cầu là cho tệp .txt và có tham số _rsc
      if (
        typeof input === 'string' && 
        (input.endsWith('.txt') || 
         input.includes('_rsc=') || 
         input.includes('/index.txt'))
      ) {
        console.log('Intercepted fetch request:', input);
        
        // Trả về phản hồi trống với mã trạng thái 200
        return Promise.resolve(new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      
      // Nếu không, sử dụng fetch gốc
      return originalFetch.apply(this, arguments);
    };

    // Kiểm tra xem người dùng đã đăng nhập chưa
    const checkAuth = () => {
      try {
        // Sử dụng window để đảm bảo chỉ chạy ở client-side
        if (typeof window !== 'undefined') {
          // Kiểm tra xem localStorage có khả dụng không
          const isLocalStorageAvailable = () => {
            try {
              const testKey = '__test__';
              localStorage.setItem(testKey, testKey);
              localStorage.removeItem(testKey);
              return true;
            } catch (e) {
              return false;
            }
          };
          
          // Kiểm tra xem sessionStorage có khả dụng không
          const isSessionStorageAvailable = () => {
            try {
              const testKey = '__test__';
              sessionStorage.setItem(testKey, testKey);
              sessionStorage.removeItem(testKey);
              return true;
            } catch (e) {
              return false;
            }
          };
          
          // Kiểm tra cookie trước
          const getCookieValue = (name) => {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : null;
          };
          
          const authCookie = getCookieValue('adminAuth');
          let authData = null;
          
          // Thử lấy từ localStorage nếu có thể
          if (isLocalStorageAvailable()) {
            authData = localStorage.getItem('adminAuth');
            console.log('Auth data from localStorage:', authData ? 'Found' : 'Not found');
          } else {
            console.log('localStorage is not available (possibly in incognito mode)');
            // Sử dụng cookie nếu localStorage không khả dụng
            authData = authCookie;
            console.log('Using cookie for auth:', authData ? 'Found' : 'Not found');
          }

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

              // Cập nhật cookie để đồng bộ
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
            let redirectFlag = false;
            
            if (isSessionStorageAvailable()) {
              redirectFlag = sessionStorage.getItem('redirecting');
              if (!redirectFlag) {
                sessionStorage.setItem('redirecting', 'true');
              }
            }
            
            if (!redirectFlag) {
              // Sử dụng cookie làm flag nếu sessionStorage không khả dụng
              document.cookie = 'redirecting=true; path=/; max-age=10'; // Chỉ tồn tại 10 giây
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
        try {
          sessionStorage.removeItem('redirecting');
        } catch (e) {
          console.log('sessionStorage is not available');
        }
        // Xóa cookie flag
        document.cookie = 'redirecting=; path=/; max-age=0';
        // Khôi phục fetch gốc
        window.fetch = originalFetch;
      }
    };
  }, [pathname]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    try {
      localStorage.removeItem('adminAuth');
    } catch (e) {
      console.log('localStorage is not available');
    }
    // Luôn xóa cookie
    document.cookie = 'adminAuth=; path=/; max-age=0';
    window.location.href = '/admin/login';
  };

  // Nếu đang ở trang đăng nhập, chỉ hiển thị nội dung con
  if (pathname === '/admin/login' || !isClient) {
    return <>{children}</>;
  }

  // Nếu chưa đăng nhập, hiển thị trang loading
  if (!isLoggedIn) {
    return <div className="admin-loading">Loading...</div>;
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
