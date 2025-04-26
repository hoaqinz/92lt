// Local storage keys
const STORAGE_KEYS = {
  POSTS: 'posts',
  IMAGES: 'images',
  USER: 'user',
};

// Interface cho post metadata
interface PostMetadata {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
}

// Interface cho image metadata
interface ImageMetadata {
  id: string;
  url: string;
  uploadedAt: string;
}

class StorageService {
  // Posts
  static getPosts(): PostMetadata[] {
    try {
      const posts = localStorage.getItem(STORAGE_KEYS.POSTS);
      return posts ? JSON.parse(posts) : [];
    } catch {
      return [];
    }
  }

  static getPostBySlug(slug: string): PostMetadata | null {
    const posts = this.getPosts();
    return posts.find(post => post.slug === slug) || null;
  }

  static savePost(post: PostMetadata): void {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === post.id);
    
    if (index > -1) {
      posts[index] = post;
    } else {
      posts.push(post);
    }

    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }

  static deletePost(id: string): void {
    const posts = this.getPosts().filter(post => post.id !== id);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }

  // Images
  static saveImage(metadata: ImageMetadata): void {
    const images = this.getImages();
    images.push(metadata);
    localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
  }

  static getImages(): ImageMetadata[] {
    try {
      const images = localStorage.getItem(STORAGE_KEYS.IMAGES);
      return images ? JSON.parse(images) : [];
    } catch {
      return [];
    }
  }

  static deleteImage(id: string): void {
    const images = this.getImages().filter(img => img.id !== id);
    localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
  }
}

export default StorageService;