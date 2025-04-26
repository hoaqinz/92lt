// API client cho Cloudflare Worker API

// Định nghĩa kiểu dữ liệu cho bài viết
export interface Post {
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

// Định nghĩa kiểu dữ liệu cho banner
export interface Banner {
  id: number;
  title: string;
  image: string;
  link?: string;
  buttonText?: string;
  order: number;
  status: 'active' | 'inactive';
}

// Định nghĩa kiểu dữ liệu cho icon
export interface Icon {
  id: number;
  name: string;
  image: string;
  link?: string;
  order: number;
  status: 'active' | 'inactive';
}

// Định nghĩa kiểu dữ liệu cho khuyến mãi
export interface Promotion {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string;
  endDate?: string;
  order: number;
  status: 'active' | 'inactive';
}

// URL cơ sở của API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.92lottery.dev';

// Hàm fetch chung với xử lý lỗi
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// API Posts
export const PostsAPI = {
  // Lấy tất cả bài viết
  getAll: async (): Promise<Post[]> => {
    return fetchAPI<Post[]>('/api/posts');
  },

  // Lấy bài viết theo slug
  getBySlug: async (slug: string): Promise<Post> => {
    return fetchAPI<Post>(`/api/posts/${slug}`);
  },

  // Tạo bài viết mới
  create: async (post: Omit<Post, 'id'>): Promise<Post> => {
    return fetchAPI<Post>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },

  // Cập nhật bài viết
  update: async (id: number, post: Partial<Post>): Promise<Post> => {
    return fetchAPI<Post>(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  },

  // Xóa bài viết
  delete: async (id: number): Promise<{ success: boolean }> => {
    return fetchAPI<{ success: boolean }>(`/api/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

// API Banners
export const BannersAPI = {
  // Lấy tất cả banner
  getAll: async (): Promise<Banner[]> => {
    return fetchAPI<Banner[]>('/api/banners');
  },

  // Tạo banner mới
  create: async (banner: Omit<Banner, 'id'>): Promise<Banner> => {
    return fetchAPI<Banner>('/api/banners', {
      method: 'POST',
      body: JSON.stringify(banner),
    });
  },

  // Cập nhật banner
  update: async (id: number, banner: Partial<Banner>): Promise<Banner> => {
    return fetchAPI<Banner>(`/api/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(banner),
    });
  },

  // Xóa banner
  delete: async (id: number): Promise<{ success: boolean }> => {
    return fetchAPI<{ success: boolean }>(`/api/banners/${id}`, {
      method: 'DELETE',
    });
  },
};

// API Icons
export const IconsAPI = {
  // Lấy tất cả icon
  getAll: async (): Promise<Icon[]> => {
    return fetchAPI<Icon[]>('/api/icons');
  },

  // Tạo icon mới
  create: async (icon: Omit<Icon, 'id'>): Promise<Icon> => {
    return fetchAPI<Icon>('/api/icons', {
      method: 'POST',
      body: JSON.stringify(icon),
    });
  },

  // Cập nhật icon
  update: async (id: number, icon: Partial<Icon>): Promise<Icon> => {
    return fetchAPI<Icon>(`/api/icons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(icon),
    });
  },

  // Xóa icon
  delete: async (id: number): Promise<{ success: boolean }> => {
    return fetchAPI<{ success: boolean }>(`/api/icons/${id}`, {
      method: 'DELETE',
    });
  },
};

// API Promotions
export const PromotionsAPI = {
  // Lấy tất cả khuyến mãi
  getAll: async (): Promise<Promotion[]> => {
    return fetchAPI<Promotion[]>('/api/promotions');
  },

  // Tạo khuyến mãi mới
  create: async (promotion: Omit<Promotion, 'id'>): Promise<Promotion> => {
    return fetchAPI<Promotion>('/api/promotions', {
      method: 'POST',
      body: JSON.stringify(promotion),
    });
  },

  // Cập nhật khuyến mãi
  update: async (id: number, promotion: Partial<Promotion>): Promise<Promotion> => {
    return fetchAPI<Promotion>(`/api/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promotion),
    });
  },

  // Xóa khuyến mãi
  delete: async (id: number): Promise<{ success: boolean }> => {
    return fetchAPI<{ success: boolean }>(`/api/promotions/${id}`, {
      method: 'DELETE',
    });
  },
};

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const IMAGE_DELIVERY_URL = `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_ID}`;

// Get direct upload URL from Cloudflare Images
export async function getUploadUrl() {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    return response.json();
  } catch (error) {
    console.error('Error getting upload URL:', error);
    throw error;
  }
}

// Upload file directly to Cloudflare Images
export async function uploadImage(file: File) {
  try {
    // Get upload URL
    const { result } = await getUploadUrl();
    const { uploadURL } = result;

    // Upload file
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch(uploadURL, {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }

    const uploadResult = await uploadResponse.json();
    return {
      success: true,
      imageUrl: `${IMAGE_DELIVERY_URL}/${uploadResult.result.id}/public`
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Delete image from Cloudflare Images
export async function deleteImage(imageId: string) {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}
