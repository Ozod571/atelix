/**
 * Rasmni brauzerda siqib, data URL (base64) ga aylantiradi.
 * Server tomonga yuborishdan oldin hajmni kichraytiradi.
 */
export async function fileToCompressedDataURL(
  file: File,
  maxDim = 1000,
  quality = 0.72
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Faqat rasm fayllari qabul qilinadi");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Faylni o'qib bo'lmadi"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Rasmni yuklab bo'lmadi"));
    image.src = dataUrl;
  });

  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl; // fallback
  ctx.drawImage(img, 0, 0, width, height);

  // GIF/PNG shaffofligi bo'lmasa JPEG eng ixcham
  return canvas.toDataURL("image/jpeg", quality);
}
