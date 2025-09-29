"use client";

import { useState } from "react";
import Image from "next/image";

type AvatarStyle =
  | "id_photo"
  | "cartoon_anime"
  | "chibi"
  | "cyberpunk"
  | "vaporwave"
  | "pixel_art"
  | "emoji";

interface StyleOption {
  id: AvatarStyle;
  name: string;
  description: string;
  icon: string;
}

const styleOptions: StyleOption[] = [
  {
    id: "id_photo",
    name: "证件照",
    description: "专业商务风格证件照",
    icon: "👔",
  },
  {
    id: "cartoon_anime",
    name: "卡通动漫",
    description: "日式动漫风格头像",
    icon: "🎌",
  },
  { id: "chibi", name: "Q版头像", description: "可爱Q版卡通风格", icon: "🎎" },
  {
    id: "cyberpunk",
    name: "赛博朋克",
    description: "未来科技风格头像",
    icon: "🤖",
  },
  {
    id: "vaporwave",
    name: "蒸汽波",
    description: "复古未来主义风格",
    icon: "🌆",
  },
  {
    id: "pixel_art",
    name: "像素风",
    description: "8位像素艺术风格",
    icon: "🎮",
  },
  { id: "emoji", name: "Emoji风格", description: "表情包风格头像", icon: "😀" },
];

export default function AvatarGenerator() {
  const [userInput, setUserInput] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>("cyberpunk");
  const [selectedFormat, setSelectedFormat] = useState<"png" | "jpg">("png");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setError("请输入头像描述内容");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: userInput.trim(),
          style: selectedStyle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "生成失败");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成头像时出现错误");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      // 创建canvas来转换图片格式
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("无法获取 canvas context");
        return;
      }

      const img = document.createElement("img"); // 使用 document.createElement 而不是 new Image()

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // 如果是PNG，保持透明背景；如果是JPG，添加白色背景
        if (selectedFormat === "png") {
          ctx.drawImage(img, 0, 0);
        } else {
          // JPG格式，添加白色背景
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }

        // 转换并下载
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `avatar-${selectedStyle}-${Date.now()}.${selectedFormat}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          },
          `image/${selectedFormat}`,
          0.95
        );
      };

      img.crossOrigin = "anonymous"; // 添加跨域支持
      img.src = generatedImage;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 动态背景网格 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      {/* 发光粒子效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* 头部标题 - 科技风格 */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-6 tracking-wider">
                AI AVATAR GENERATOR
              </h1>
              <div className="flex items-center justify-center space-x-3 text-cyan-300 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-base font-mono uppercase tracking-[0.3em]">
                  SYSTEM ONLINE
                </span>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              </div>
              {/* 炫酷分割线 */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-cyan-400"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                <div className="h-px w-40 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                <div className="h-px w-20 bg-gradient-to-r from-purple-400 to-transparent"></div>
              </div>
            </div>
            <p className="text-xl text-gray-300 font-mono tracking-wider">
              [ NEURAL NETWORK POWERED AVATAR SYNTHESIS ]
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* 左侧控制面板 - 赛博朋克风格 */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
              <div className="space-y-8">
                {/* 输入框 */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                    <label className="text-lg font-mono text-cyan-300 uppercase tracking-wider">
                      INPUT PROMPT
                    </label>
                  </div>
                  <div className="relative">
                    <textarea
                      rows={4}
                      className="w-full px-4 py-4 bg-black/80 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 resize-none font-mono transition-all duration-300"
                      placeholder="> DESCRIBE YOUR AVATAR..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      maxLength={200}
                    />
                    <div className="absolute bottom-2 right-3 text-xs text-gray-400 font-mono">
                      {userInput.length}/200
                    </div>
                  </div>
                </div>

                {/* 风格选择 */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    <label className="text-lg font-mono text-purple-300 uppercase tracking-wider">
                      STYLE MATRIX
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {styleOptions.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedStyle === style.id
                            ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20"
                            : "border-gray-700 bg-gray-800/50 hover:border-cyan-400/50 hover:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{style.icon}</span>
                          <div className="text-left">
                            <div
                              className={`text-sm font-bold font-mono ${
                                selectedStyle === style.id
                                  ? "text-cyan-300"
                                  : "text-white"
                              }`}
                            >
                              {style.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {style.description}
                            </div>
                          </div>
                        </div>
                        {selectedStyle === style.id && (
                          <div className="absolute inset-0 border-2 border-cyan-400 rounded-xl animate-pulse"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 生成按钮 */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !userInput.trim()}
                  className="relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 disabled:cursor-not-allowed overflow-hidden group"
                >
                  {/* 按钮背景动画 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative flex items-center justify-center space-x-3">
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-mono uppercase tracking-wider">
                          GENERATING...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono uppercase tracking-wider">
                          INITIATE SYNTHESIS
                        </span>
                        <div className="w-2 h-2 bg-black rounded-full group-hover:animate-ping"></div>
                      </>
                    )}
                  </div>
                </button>

                {/* 错误信息 */}
                {error && (
                  <div className="bg-red-900/50 border-2 border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-300 text-sm font-mono">
                        ERROR:
                      </span>
                    </div>
                    <p className="text-red-200 text-sm mt-2 font-mono">
                      {error}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 右侧预览区域 - 全息投影风格 */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-mono text-green-300 uppercase tracking-wider">
                    OUTPUT DISPLAY
                  </h3>
                </div>

                <div className="relative">
                  {/* 全息显示框 */}
                  <div className="aspect-square bg-black rounded-2xl border-2 border-dashed border-gray-600 relative overflow-hidden group">
                    {/* 扫描线效果 */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-pulse"></div>

                    {generatedImage ? (
                      <div className="w-full h-full relative">
                        <Image
                          src={generatedImage}
                          alt="Generated Avatar"
                          fill
                          className="object-cover rounded-2xl"
                        />
                        {/* 全息效果叠加 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/10 to-transparent opacity-50"></div>
                        <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded-lg">
                          <span className="text-xs text-green-400 font-mono">
                            RENDER COMPLETE
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                        {isGenerating ? (
                          <div className="space-y-4">
                            <div className="relative w-20 h-20 mx-auto">
                              <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full"></div>
                              <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-cyan-300 font-mono text-sm">
                                NEURAL PROCESSING...
                              </p>
                              <div className="flex justify-center space-x-1">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-20 h-20 mx-auto bg-gray-800/50 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                              <svg
                                className="w-10 h-10 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                                AWAITING INPUT
                              </p>
                              <div className="flex justify-center">
                                <div className="w-1 h-4 bg-gray-600 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {generatedImage && (
                  <div className="space-y-4">
                    {/* 格式选择 */}
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <span className="text-sm font-mono text-gray-400 uppercase">
                        FORMAT:
                      </span>
                      <button
                        onClick={() => setSelectedFormat("png")}
                        className={`px-4 py-2 rounded-lg font-mono text-xs uppercase transition-all duration-200 ${
                          selectedFormat === "png"
                            ? "bg-cyan-500 text-black"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        PNG
                      </button>
                      <button
                        onClick={() => setSelectedFormat("jpg")}
                        className={`px-4 py-2 rounded-lg font-mono text-xs uppercase transition-all duration-200 ${
                          selectedFormat === "jpg"
                            ? "bg-cyan-500 text-black"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        JPG
                      </button>
                    </div>

                    <button
                      onClick={handleDownload}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 font-mono uppercase tracking-wider shadow-lg shadow-green-500/20"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>DOWNLOAD {selectedFormat.toUpperCase()}</span>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 底部状态栏 */}
          <div className="mt-16 bg-black/80 backdrop-blur border border-gray-700 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-mono text-sm uppercase">
                    SYSTEM STATUS
                  </span>
                </div>
                <p className="text-gray-400 text-xs font-mono">
                  AI CORE: OPERATIONAL
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 font-mono text-sm uppercase">
                    NEURAL LINK
                  </span>
                </div>
                <p className="text-gray-400 text-xs font-mono">
                  STABLE DIFFUSION 3.0
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-400 font-mono text-sm uppercase">
                    OUTPUT RES
                  </span>
                </div>
                <p className="text-gray-400 text-xs font-mono">
                  512 x 512 PIXELS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
