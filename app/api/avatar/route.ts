import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// 定义头像风格类型
type AvatarStyle =
  | "id_photo"
  | "cartoon_anime"
  | "chibi"
  | "cyberpunk"
  | "vaporwave"
  | "pixel_art"
  | "emoji";

// 风格对应的提示词模板
const stylePrompts: Record<AvatarStyle, string> = {
  id_photo:
    "professional headshot portrait, clean background, business attire, high quality, studio lighting, formal pose, passport photo style",

  cartoon_anime:
    "anime style portrait, manga art, cel shading, vibrant colors, large expressive eyes, clean line art, digital painting, kawaii aesthetic",

  chibi:
    "chibi style, super cute, big head small body proportions, kawaii, pastel colors, soft shading, adorable expression, Q-version character",

  cyberpunk:
    "cyberpunk portrait, neon lights, futuristic, glowing eyes, cybernetic implants, dark urban background, sci-fi aesthetic, digital art, high tech low life",

  vaporwave:
    "vaporwave aesthetic, retro synthwave, neon pink and purple colors, 80s nostalgia, glitch effects, geometric shapes, sunset gradient background",

  pixel_art:
    "pixel art style, 8-bit graphics, retro gaming aesthetic, blocky pixels, limited color palette, sprite art, vintage video game character",

  emoji:
    "emoji style, simple cartoon face, bold colors, minimalist design, round shape, expressive features, mobile emoji aesthetic, flat design",
};

// 构建完整的提示词
function buildPrompt(userInput: string, style: AvatarStyle): string {
  const basePrompt = stylePrompts[style];
  return `${userInput}, ${basePrompt}, 512x512 pixels, centered composition, high quality, detailed, profile picture, avatar`;
}

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const { userInput, style } = await request.json();

    // 验证输入
    if (
      !userInput ||
      typeof userInput !== "string" ||
      userInput.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "请提供有效的头像描述" },
        { status: 400 }
      );
    }

    if (!style || !stylePrompts[style as AvatarStyle]) {
      return NextResponse.json(
        { error: "请选择有效的头像风格" },
        { status: 400 }
      );
    }

    // 检查 API 密钥
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      console.error("缺少 STABILITY_API_KEY 环境变量");
      return NextResponse.json(
        { error: "服务配置错误，请联系管理员" },
        { status: 500 }
      );
    }

    // 构建完整提示词
    const fullPrompt = buildPrompt(userInput.trim(), style as AvatarStyle);
    console.log("生成提示词:", fullPrompt);

    // 准备 API 请求数据
    const payload = {
      prompt: fullPrompt,
      output_format: "webp",
    };

    // 调用 Stability AI API
    console.log("正在调用 Stability AI API...");
    console.log("请求数据:", payload);

    // 使用 FormData 发送 multipart/form-data 请求
    const formData = new FormData();
    formData.append("prompt", payload.prompt);
    formData.append("output_format", payload.output_format);

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "image/*",
          // 不要设置 Content-Type，让浏览器自动设置为 multipart/form-data
        },
        body: formData,
      }
    );

    console.log("API 响应状态:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 错误详情:", errorText);

      let errorMessage = "图片生成失败";

      switch (response.status) {
        case 400:
          errorMessage = "请求参数无效，请检查输入内容";
          break;
        case 401:
          errorMessage = "API 认证失败，请检查 API 密钥";
          break;
        case 402:
          errorMessage = "API 配额不足";
          break;
        case 403:
          errorMessage = "访问被拒绝";
          break;
        case 429:
          errorMessage = "请求过于频繁，请稍后重试";
          break;
        case 500:
          errorMessage = "AI 服务暂时不可用，请稍后重试";
          break;
        default:
          errorMessage = `服务错误 (${response.status})`;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status >= 500 ? 500 : 400 }
      );
    }

    // 获取图片数据
    const imageBuffer = await response.arrayBuffer();

    if (!imageBuffer || imageBuffer.byteLength === 0) {
      console.error("API 返回了空的图片数据");
      return NextResponse.json(
        { error: "生成的图片数据无效" },
        { status: 500 }
      );
    }

    console.log("头像生成成功，图片大小:", imageBuffer.byteLength, "bytes");

    // 返回图片数据
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": imageBuffer.byteLength.toString(),
        "Cache-Control": "no-cache", // 禁用缓存以避免重复图片
      },
    });
  } catch (error) {
    console.error("API 路由错误:", error);

    // 处理 fetch 错误
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { error: "网络连接失败，请检查网络后重试" },
        { status: 503 }
      );
    }

    // 其他未知错误
    return NextResponse.json(
      { error: "服务器内部错误，请稍后重试" },
      { status: 500 }
    );
  }
}
