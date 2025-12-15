import fs from 'fs';
import path from 'path';
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

function generateAvatar(
  initials: string,
  filePath: string,
  size = 128
): string {
  const bgColor = getRandomColor();
  const textColor = isDarkColor(bgColor) ? '#FFFFFF' : '#000000';

  const svg = new UIAvatarSvg()
    .text(initials)
    .size(size)
    .bgColor(bgColor)
    .textColor(textColor)
    .generate();

  fs.writeFileSync(filePath, svg);
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
  console.log(filePath)
  generateAvatar(initials, filePath);

  return `/avatars/${uid}/${imageName}`;
}
