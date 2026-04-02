"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, RefreshCw, Github, Download } from 'lucide-react';
import { PROVERBS } from './data/proverbs';
import { MIKU_URLS } from './data/mikuUrls';

// --- DATA ---


// --- COMPONENT ---

export default function MikuCatWisdom() {
  const [mounted, setMounted] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [proverb, setProverb] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatMemeText = (text: string) => {
    if (!text) return { top: "", bottom: "" };
    const words = text.split(" ");
    const mid = Math.ceil(words.length / 2);
    const top = words.slice(0, mid).join(" ").toUpperCase();
    const bottom = words.slice(mid).join(" ").toUpperCase();
    return { top, bottom };
  };

  const drawMeme = useCallback((img: HTMLImageElement, topText: string, bottomText: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw Image (Cover & Top Position)
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.width;
    const ih = img.height;

    const ratio = Math.max(cw / iw, ch / ih);
    const nw = iw * ratio;
    const nh = ih * ratio;
    const nx = (cw - nw) / 2;
    const ny = 0; // Object-top

    ctx.clearRect(0, 0, cw, ch);

    try {
      ctx.drawImage(img, nx, ny, nw, nh);
    } catch (e) {
      console.error("CANVAS DRAW ERROR (Potential CORS/Taint issue):", e);
    }

    // 2. Draw Text Logic
    const padding = 50;
    const maxWidth = cw - (padding * 2);
    const fontSize = 100;
    const lineHeight = fontSize * 1.0;

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 12;
    ctx.lineJoin = 'round';
    ctx.textAlign = 'center';
    ctx.font = `normal ${fontSize}px Impact, "Arial Narrow Bold", sans-serif`;

    // @ts-ignore - letterSpacing is relatively new but supported in modern browsers
    if ('letterSpacing' in ctx) ctx.letterSpacing = "2px";

    const wrapAndRenderText = (text: string, startY: number, isTop: boolean) => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);

      // Render each line
      lines.forEach((line, index) => {
        const y = isTop
          ? startY + (index * lineHeight)
          : startY - ((lines.length - 1 - index) * lineHeight);

        // Shadow stack
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        for (let i = 0; i < 3; i++) {
          ctx.strokeText(line, cw / 2, y);
        }

        ctx.shadowBlur = 0;
        ctx.strokeText(line, cw / 2, y);
        ctx.fillText(line, cw / 2, y);
      });
    };

    if (topText) wrapAndRenderText(topText, 112, true);
    if (bottomText) wrapAndRenderText(bottomText, ch - 32, false);
  }, []);

  const lastImageUrlRef = useRef<string>("");
  const lastProverbRef = useRef<string>("");

  const loadImageAndDraw = useCallback((url: string, currentProverb: string) => {
    const img = new Image();
    // CRITICAL for Canvas: Set crossOrigin BEFORE src
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      console.log(`--- IMAGE LOADED: ${url} ---`);
      const { top, bottom } = formatMemeText(currentProverb);
      drawMeme(img, top, bottom);
      setIsLoading(false);
    };

    img.onerror = (e) => {
      console.error(`IMAGE LOAD ERROR: ${url}. Falling back to Miku.`, e);
      // Re-enable Fallback
      const fallbackUrl = MIKU_URLS[Math.floor(Math.random() * MIKU_URLS.length)];
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = "anonymous";
      fallbackImg.src = `${fallbackUrl}?t=${Date.now()}`;
      fallbackImg.onload = () => {
        const { top, bottom } = formatMemeText(currentProverb);
        drawMeme(fallbackImg, top, bottom);
        setIsLoading(false);
      };
      fallbackImg.onerror = () => setIsLoading(false);
    };
  }, [drawMeme]);

  const generateMeme = useCallback(async () => {
    setIsLoading(true);

    let newProverb = "";
    do {
      newProverb = PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
    } while (newProverb === lastProverbRef.current);
    lastProverbRef.current = newProverb;
    setProverb(newProverb);

    // RESTORE Normal 50/50 Selection
    const category = Math.random() < 0.5 ? 'cat' : 'miku';
    console.log(`--- GENERATING MEME: ${category.toUpperCase()} ---`);

    let newUrl = "";
    try {
      if (category === 'cat') {
        // Ultimate Simple & Robust Cat Link
        newUrl = `https://cataas.com/cat?t=${Date.now()}`;
      } else {
        // Miku Category
        let attempts = 0;
        do {
          const randomMiku = MIKU_URLS[Math.floor(Math.random() * MIKU_URLS.length)];
          newUrl = `${randomMiku}?t=${Date.now()}`;
          attempts++;
        } while (newUrl === lastImageUrlRef.current && attempts < 5);
      }

      console.log(`Target URL: ${newUrl}`);
      setImageUrl(newUrl);
      lastImageUrlRef.current = newUrl;

      // 3. Drawing Process
      loadImageAndDraw(newUrl, newProverb);

    } catch (error) {
      console.error("Selection Error, forcing Miku fallback:", error);
      const fallbackMiku = MIKU_URLS[0];
      loadImageAndDraw(fallbackMiku, newProverb);
    }
  }, [loadImageAndDraw]);

  useEffect(() => {
    setMounted(true);
    generateMeme();
  }, [generateMeme]);

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!mounted) return <div className="min-h-screen bg-neutral-950" />;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-miku-cyan rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />

      <main className="z-10 flex flex-col items-center w-full max-w-2xl">
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Chud<span className="text-miku-cyan font-black">Memes</span>
          </h1>
          <p className="text-neutral-400 max-w-md mx-auto relative z-10">
            Generate and download timeless wisdom.
          </p>
        </div>

        <div className="glassmorphism p-4 md:p-6 rounded-3xl w-full flex flex-col items-center mx-auto shadow-2xl relative transition-all duration-500 ease-out hover:shadow-miku-glow">

          <div className="relative w-full aspect-square rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden group">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-neutral-950/50 backdrop-blur-sm">
                <RefreshCw className="w-10 h-10 text-miku-cyan animate-spin" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={1080}
              height={1080}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="flex flex-col md:flex-row w-full gap-4 mt-6">
            <button
              onClick={() => generateMeme()}
              disabled={isLoading}
              type="button"
              className="flex-1 bg-miku-cyan hover:bg-miku-cyan-hover text-neutral-950 font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3 shadow-lg shadow-miku-cyan/30 focus:outline-none focus:ring-4 focus:ring-miku-cyan/50"
            >
              <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Processing...' : 'New Wisdom'}</span>
            </button>

            <button
              onClick={downloadMeme}
              disabled={isLoading || !imageUrl}
              type="button"
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3 border border-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-600"
            >
              <Download className="w-6 h-6" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-neutral-500 text-sm flex items-center justify-center space-x-2 z-10">
        <Github className="w-4 h-4" />
        <span>Inspired by the internet</span>
      </footer>
    </div>
  );
}
