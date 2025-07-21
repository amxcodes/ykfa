import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const soundsDir = path.join(__dirname, 'public', 'sounds');

ffmpeg.setFfmpegPath(ffmpegPath);

fs.readdir(soundsDir, (err, files) => {
  if (err) {
    console.error('Error reading sounds directory:', err);
    process.exit(1);
  }

  const mp3Files = files.filter(f => f.endsWith('.mp3'));
  if (mp3Files.length === 0) {
    console.log('No .mp3 files found in public/sounds/.');
    return;
  }

  mp3Files.forEach(mp3File => {
    const oggFile = mp3File.replace(/\.mp3$/i, '.ogg');
    const oggPath = path.join(soundsDir, oggFile);
    const mp3Path = path.join(soundsDir, mp3File);

    if (fs.existsSync(oggPath)) {
      console.log(`Skipping ${mp3File} (already has .ogg)`);
      return;
    }

    console.log(`Converting ${mp3File} -> ${oggFile} ...`);
    ffmpeg(mp3Path)
      .output(oggPath)
      .audioCodec('libvorbis')
      .on('end', () => {
        console.log(`Done: ${oggFile}`);
      })
      .on('error', err => {
        console.error(`Error converting ${mp3File}:`, err.message);
      })
      .run();
  });
}); 