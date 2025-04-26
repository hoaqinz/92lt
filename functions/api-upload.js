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

    // Trả về thông báo thành công giả với URL giả
    // Sử dụng URL từ dummyimage.com thay vì via.placeholder.com
    const fakeImageUrl = "https://dummyimage.com/800x600/e60000/ffffff.png&text=Test+Image";

    return new Response(
      JSON.stringify({
        success: true,
        url: fakeImageUrl,
        message: "This is a placeholder URL for testing. In production, this would be a real image URL."
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error processing image:", error);

    return new Response(JSON.stringify({ 
      error: "Failed to process image",
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
