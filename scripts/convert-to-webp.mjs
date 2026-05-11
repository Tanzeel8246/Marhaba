import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = 'artifacts/bake-delight-pro/public/images';

async function convert() {
  const files = fs.readdirSync(imagesDir);
  for (const file of files) {
    if (file.endsWith('.png')) {
      const filePath = path.join(imagesDir, file);
      const outputFilePath = filePath.replace('.png', '.webp');
      
      console.log(`Converting ${file} to WebP...`);
      await sharp(filePath)
        .webp({ quality: 80 })
        .toFile(outputFilePath);
        
      console.log(`Converted ${file} to WebP.`);
    }
  }
}

convert().catch(console.error);
