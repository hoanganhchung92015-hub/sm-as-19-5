import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // Gọi trực tiếp đến Google API bằng Fetch (Không cần thư viện ngoài)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    // Kiểm tra xem Google có trả về lỗi không
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Lỗi API" }, { status: response.status });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ text: aiResponse });

  } catch (error) {
    return NextResponse.json({ error: "Lỗi kết nối hệ thống" }, { status: 500 });
  }
}

