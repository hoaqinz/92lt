import { Env } from '../types';

export interface Env {
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_HASH: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const formData = await context.request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'File must be an image' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Kiểm tra kích thước file (giới hạn 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File size must be less than 10MB' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Tải lên Cloudflare Images
    const uploadResponse = await uploadToCloudflareImages(file, context.env);

    return new Response(JSON.stringify(uploadResponse), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to upload image' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};

async function uploadToCloudflareImages(file: File, env: Env) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Cloudflare Images API error:', error);
    throw new Error('Failed to upload to Cloudflare Images');
  }

  const result = await response.json();
  
  // Tạo URL từ ID hình ảnh và account hash
  const imageId = result.result.id;
  const imageUrl = `https://imagedelivery.net/${env.CLOUDFLARE_ACCOUNT_HASH}/${imageId}/public`;
  
  return { 
    success: true, 
    url: imageUrl,
    id: imageId
  };
}
