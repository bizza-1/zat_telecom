// Frontend-only "image storage": turn a picked File into a compressed data URL.
//
// localStorage caps around ~5MB, and raw phone photos are multi-MB each, so we
// downscale the longest edge and re-encode as JPEG before the image ever enters
// the store. When a real backend/CDN arrives, this is replaced by an upload that
// returns a hosted URL — callers still just receive a string.

const DEFAULT_MAX_DIM = 1000;
const DEFAULT_QUALITY = 0.8;

export function fileToDataUrl(
  file: File,
  maxDim: number = DEFAULT_MAX_DIM,
  quality: number = DEFAULT_QUALITY
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image file"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas is not supported in this browser"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
