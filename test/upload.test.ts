import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

import jestGlobals from '../jest.globals';
import Client from '../src';

const localImages = [
  join(__dirname, './images/test-image.webp'),
  join(__dirname, './images/test-image.png'),
  join(__dirname, './images/test-image.jpg'),
];

describe('Image Upload', () => {
  const client: Client = new Client(
    jestGlobals.ACCOUNT_IDENTIFIER,
    jestGlobals.AUTH_KEY,
  );

  test.each(localImages.map((l) => [l]))(
    'Uploads Streamed Image %s',
    async (imagePath: string) => {
      const readStream = createReadStream(imagePath);

      await expect(client.upload(readStream)).resolves.toMatchObject({
        success: true,
      });
    },
  );

  test.each(localImages.map((l) => [l]))(
    'Uploads Buffered Image %s',
    async (imagePath: string) => {
      const fileContents = await readFile(imagePath);

      await expect(client.upload(fileContents)).resolves.toMatchObject({
        success: true,
      });
    },
  );

  test.each(localImages.map((l) => [l]))(
    'Uploads FS Image %s',
    async (imagePath: string) => {
      await expect(client.upload(imagePath)).resolves.toMatchObject({
        success: true,
      });
    },
  );

  test('Uploads Image From URL', async () => {
    await expect(
      client.upload(
        'https://raw.githubusercontent.com/BitPatty/cloudflare-images-api/60400314e40c44f3272519db3fe6a801f7e78435/test/images/test-image.webp',
      ),
    ).resolves.toMatchObject({
      success: true,
    });
  });

  test('Stores Metadata', async () => {
    await expect(
      client.upload(localImages[0], {
        metadata: {
          foo: 'bar',
        },
      }),
    ).resolves.toMatchObject({
      success: true,
      result: {
        meta: {
          foo: 'bar',
        },
      },
    });
  });
});
