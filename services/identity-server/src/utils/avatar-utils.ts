import { botttsNeutral } from '@dicebear/collection';
import { toPng } from '@dicebear/converter';
import { createAvatar } from '@dicebear/core';
import { MultipartFile } from '@fastify/multipart';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

const avatarsDir = '/var/avatars';

export default async function saveAvatar(
    uid: string,
    username: string
): Promise<string> {
    const userDir = path.join(avatarsDir, uid);
    await fs.promises.mkdir(userDir, { recursive: true });

    const filePath = path.join(userDir, username);

    const avatar = createAvatar(botttsNeutral, {
        seed: username,
        size: 256,
    });

    const png = toPng(avatar.toString());
    const buffer = await png.toArrayBuffer();

    await fs.promises.writeFile(filePath, Buffer.from(buffer));

    return `/avatars/${uid}/${username}`;
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

export async function validateImageFile(part: MultipartFile) {
  const chunks: Buffer[] = [];
  for await (const chunk of part.file) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);

  const type = await fileTypeFromBuffer(buffer);
  if (!type?.mime.startsWith("image/")) {
    throw new Error("Invalid image content");
  }

  const readableStream = Readable.from(buffer) as any;
  readableStream.truncated = false;
  readableStream.bytesRead = buffer.length;

  return readableStream;
}
