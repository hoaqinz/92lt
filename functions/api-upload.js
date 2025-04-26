export async function onRequest(context) {
  // Xử lý CORS
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Chỉ chấp nhận phương thức POST
  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const formData = await context.request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      return new Response(JSON.stringify({ error: "File must be an image" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Kiểm tra kích thước file (giới hạn 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "File size must be less than 10MB" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Sử dụng giá trị cố định thay vì biến môi trường
    const accountId = "04725e5acc15b760fb22bf197ff9799f";
    const apiToken = "JZYoQdkbYec97Na325HqQwEJAUn12Wh_tw6iUtPp";
    const accountHash = "tJAHQehMkQM0pKlceH1PGg";

    // Debug: In ra các biến môi trường từ context
    console.log("Environment from context:", context.env);

    // Tạo FormData mới để gửi đến Cloudflare Images API
    const cloudflareFormData = new FormData();
    cloudflareFormData.append("file", file);

    // Gửi request đến Cloudflare Images API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: cloudflareFormData,
      }
    );

    // Kiểm tra response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudflare Images API error:", errorData);
      return new Response(
        JSON.stringify({ 
          error: "Failed to upload to Cloudflare Images",
          details: errorData
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Xử lý response thành công
    const result = await response.json();
    const imageId = result.result.id;
    const imageUrl = `https://imagedelivery.net/${accountHash}/${imageId}/public`;

    return new Response(
      JSON.stringify({
        success: true,
        url: imageUrl,
        id: imageId,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error uploading image:", error);

    return new Response(JSON.stringify({ 
      error: "Failed to upload image",
      message: error.message || "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
