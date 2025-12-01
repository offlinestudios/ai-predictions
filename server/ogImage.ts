import { createCanvas, registerFont } from "canvas";
import type { Request, Response } from "express";
import { getPredictionByShareToken } from "./db";

// Category colors matching the UI
const categoryColors: Record<string, { bg: string; text: string; accent: string }> = {
  career: { bg: "#1e3a8a", text: "#60a5fa", accent: "#3b82f6" },
  love: { bg: "#831843", text: "#f9a8d4", accent: "#ec4899" },
  finance: { bg: "#14532d", text: "#86efac", accent: "#22c55e" },
  health: { bg: "#7c2d12", text: "#fdba74", accent: "#f97316" },
  general: { bg: "#581c87", text: "#c084fc", accent: "#a855f7" },
};

export async function generateOGImage(req: Request, res: Response) {
  try {
    const { shareToken } = req.params;

    if (!shareToken) {
      return res.status(400).send("Missing share token");
    }

    // Fetch prediction from database
    const prediction = await getPredictionByShareToken(shareToken);

    if (!prediction) {
      return res.status(404).send("Prediction not found");
    }

    // Canvas dimensions for OG image (1200x630 is optimal for social media)
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const category = prediction.category || "general";
    const colors = categoryColors[category] || categoryColors.general;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0f172a"); // slate-950
    gradient.addColorStop(0.5, colors.bg);
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add noise/texture overlay
    for (let i = 0; i < 1000; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 3,
        Math.random() * 3
      );
    }

    // Header section with branding
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, width, 80);

    // Logo/Icon (sparkles emoji replacement with circle)
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.arc(60, 40, 20, 0, Math.PI * 2);
    ctx.fill();

    // App name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("AI Predictions", 100, 52);

    // Category badge
    const badgeX = width - 250;
    const badgeY = 30;
    const badgeWidth = 200;
    const badgeHeight = 40;

    ctx.fillStyle = `${colors.accent}33`; // 20% opacity
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = colors.text;
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(category.toUpperCase(), badgeX + badgeWidth / 2, badgeY + 27);

    // Main content area
    ctx.textAlign = "left";

    // Question text
    const questionMaxWidth = width - 120;
    const questionText = prediction.userInput;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px sans-serif";

    // Word wrap for question
    const words = questionText.split(" ");
    let line = "";
    let y = 180;
    const lineHeight = 60;
    const maxLines = 3;
    let lineCount = 0;

    for (let i = 0; i < words.length && lineCount < maxLines; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);

      if (metrics.width > questionMaxWidth && line !== "") {
        ctx.fillText(line, 60, y);
        line = words[i] + " ";
        y += lineHeight;
        lineCount++;
      } else {
        line = testLine;
      }
    }

    if (lineCount < maxLines) {
      // Truncate if needed
      if (line.length > 60) {
        line = line.substring(0, 57) + "...";
      }
      ctx.fillText(line, 60, y);
    }

    // Prediction preview (first few lines)
    const previewY = y + 80;
    const previewText = prediction.predictionResult
      .replace(/[#*_`]/g, "")
      .substring(0, 200);

    ctx.fillStyle = "#cbd5e1"; // slate-300
    ctx.font = "24px sans-serif";

    const previewWords = previewText.split(" ");
    let previewLine = "";
    let previewLineY = previewY;
    const previewMaxLines = 3;
    let previewLineCount = 0;

    for (let i = 0; i < previewWords.length && previewLineCount < previewMaxLines; i++) {
      const testLine = previewLine + previewWords[i] + " ";
      const metrics = ctx.measureText(testLine);

      if (metrics.width > questionMaxWidth && previewLine !== "") {
        ctx.fillText(previewLine, 60, previewLineY);
        previewLine = previewWords[i] + " ";
        previewLineY += 36;
        previewLineCount++;
      } else {
        previewLine = testLine;
      }
    }

    if (previewLineCount < previewMaxLines) {
      ctx.fillText(previewLine + "...", 60, previewLineY);
    }

    // Footer with CTA
    const footerY = height - 80;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, footerY, width, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Get Your Personalized AI Predictions", width / 2, footerY + 35);

    ctx.font = "20px sans-serif";
    ctx.fillStyle = colors.text;
    ctx.fillText("Powered by Advanced AI • Free to Start", width / 2, footerY + 60);

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/png");

    // Set headers
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(buffer);
  } catch (error) {
    console.error("Error generating OG image:", error);
    res.status(500).send("Error generating image");
  }
}
