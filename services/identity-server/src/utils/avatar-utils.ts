import { MultipartFile } from '@fastify/multipart';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { pipeline } from 'stream/promises';
import UIAvatarSvg from 'ui-avatar-svg';

const avatarsDir = '/var/avatars';

if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
}

function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function isDarkColor(hex: string): boolean {
    const c = hex.startsWith('#') ? hex.substring(1) : hex;
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
}

async function generateAvatar(
    initials: string,
    filePath: string,
    size = 128
): Promise<string> {
    const bgColor = getRandomColor();
    const textColor = isDarkColor(bgColor) ? '#FFFFFF' : '#000000';

    const svg = new UIAvatarSvg()
        .text(initials.toUpperCase())
        .size(size)
        .bgColor(bgColor)
        .textColor(textColor)
        .fontWeight('bold')
        .generate();
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
    fs.writeFileSync(filePath, pngBuffer);
    return filePath;
}

export default async function saveAvatar(
    uid: string,
    initials: string,
    imageName: string
): Promise<string> {
    const userDir = path.join(avatarsDir, uid);
    await fs.promises.mkdir(userDir, { recursive: true });

    const filePath = path.join(userDir, imageName);
    console.log(filePath);
    generateAvatar(initials, filePath);

    return `/avatars/${uid}/${imageName}`;
}

export async function saveUploadedAvatar(
    uid: string,
    username: string,
    file: MultipartFile
): Promise<string> {
    const userDir = path.join(avatarsDir, uid);
    await fs.promises.mkdir(userDir, { recursive: true });
    const filePath = path.join(userDir, username);
    await pipeline(file.file, fs.createWriteStream(filePath));
    return `/avatars/${uid}/${username}`;
}

export function dicordAvatar(payload: { id: string; avatar: string | null }) {
  if (!payload.avatar) {
    const defaultIndex = parseInt(payload.id) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
  }
  const isGif = payload.avatar.startsWith('a_');
  const ext = isGif ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${payload.id}/${payload.avatar}.${ext}?size=512`;
}
