import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

import jestGlobals from '../jest.globals';
import Client from '../src';

describe('Image Upload', () => {
  const client: Client = new Client(
    jestGlobals.ACCOUNT_IDENTIFIER,
    jestGlobals.AUTH_KEY,
  );

  test.each([['./images/test-image.webp']])(
    'Uploads Streamed Image %s',
    async (imagePath: string) => {
      const readStream = createReadStream(join(__dirname, imagePath));

      await expect(client.upload(readStream)).resolves.toMatchObject({
        success: true,
      });
    },
  );

  test.each([['./images/test-image.webp']])(
    'Uploads Buffered Image %s',
    async (imagePath: string) => {
      const fileContents = await readFile(join(__dirname, imagePath));

      await expect(client.upload(fileContents)).resolves.toMatchObject({
        success: true,
      });
    },
  );

  test.each([['./images/test-image.webp']])(
    'Uploads FS Image %s',
    async (imagePath: string) => {
      await expect(
        client.upload(join(__dirname, imagePath)),
      ).resolves.toMatchObject({
        success: true,
      });
    },
  );

  test('Stores Metadata', async () => {
    await expect(
      client.upload(join(__dirname, './images/test-image.webp'), {
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
