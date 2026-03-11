import { createWorker } from "tesseract.js";
import sharp from "sharp";
import { unlinkSync } from "fs";

function normalizeDateText(text) {
  return text
    .toUpperCase()
    .replace(/[.,]/g, "/") 
    .replace(/(?<=\d)O(?=\d)/g, "0")
    .replace(/(?<=\d)Z(?=\d)/g, "2")
    .replace(/(?<=\d)S(?=\d)/g, "5")
    .replace(/(?<=\d)B(?=\d)/g, "8")
    .replace(/(?<=\d)[IL|](?=\d)/g, "1"); 
}
export async function extractText(req, res) {
  let processedImagePath = null;
  try {
    if (!req.file) return res.status(400).json({ error: "Image missing!" });
    processedImagePath = `uploads/proc-${Date.now()}.png`;
    /* ------------------ 1. AGGRESSIVE PREPROCESSING ------------------ */
    // Is step se dotted text "chipak" kar solid ban jayega
    await sharp(req.file.path)
      .resize({ height: 1000 }) // Upscaling se accuracy badhti hai
      .greyscale()
      .convolve({
        width: 3,
        height: 3,
        kernel: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5] // Dilation effect
      })
      .threshold(140) // Noise hatane ke liye
      .toFile(processedImagePath);
    /* ------------------ 2. TESSERACT CONFIG ------------------ */
    const worker = await createWorker("eng");
    
    await worker.setParameters({
      tessedit_pageseg_mode: "7", // IMPORTANT: Treat as a single line
      tessedit_ocr_engine_mode: "1", 
      tessedit_char_whitelist: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ/- ", 
      load_system_dawg: "0", // Dictionary band karein taaki alphanumeric na badle
      load_freq_dawg: "0",
    });
    const { data } = await worker.recognize(processedImagePath);
    await worker.terminate();

    const rawText = data.text;
    const cleanedText = normalizeDateText(rawText);
    /* ------------------ 3. UPDATED DATE PARSING ------------------ */
    const patterns = [
      /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g, // Catch 06/07/26 and 06/07/2026
      /\b\d{6,8}\b/g                           // Catch 060726 or 06072026
    ];
    let foundDates = [];
    for (const pattern of patterns) {
      const matches = cleanedText.match(pattern) || [];
      for (const match of matches) {
        let dateObj = null;
        const parts = match.replace(/[\-\.]/g, "/").split("/");

        if (parts.length === 3) {
          let d = parseInt(parts[0]);
          let m = parseInt(parts[1]);
          let y = parseInt(parts[2]);

          if (y < 100) y += 2000; // 26 ko 2026 banayein

          if (d > 0 && d <= 31 && m > 0 && m <= 12) {
            dateObj = new Date(y, m - 1, d);
          }
        }

        if (dateObj && !isNaN(dateObj.getTime())) {
          if (dateObj.getFullYear() >= 2020 && dateObj.getFullYear() < 2045) {
            foundDates.push(dateObj);
          }
        }
      }
    }

    foundDates.sort((a, b) => a - b);
    const finalDate = foundDates.length > 0 
      ? `${String(foundDates[foundDates.length-1].getDate()).padStart(2, "0")}/${String(foundDates[foundDates.length-1].getMonth() + 1).padStart(2, "0")}/${foundDates[foundDates.length-1].getFullYear()}`
      : null;

    /* Cleanup */
    try { unlinkSync(req.file.path); unlinkSync(processedImagePath); } catch (e) {}

    return res.status(200).json({
      success: !!finalDate,
      expiryDate: finalDate,
      debug: { raw: rawText, clean: cleanedText }
    });

  } catch (err) {
    console.error("OCR ERROR:", err);
    return res.status(500).json({ error: "OCR Processing Failed" });
  }
}