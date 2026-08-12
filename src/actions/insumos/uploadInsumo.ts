"use server";
import sharp from "sharp";

export const uploadInsumo = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const nodeBuffer = Buffer.from(arrayBuffer);
  const data = await sharp(nodeBuffer)
    .webp({ quality: 70 })
    .toFile(`./${file.name}.webp`);
  console.log(data);
};
