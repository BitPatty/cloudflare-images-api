import { join } from 'path';

import jestGlobals from '../jest.globals';
import Client from '../src';

describe('Image Lookup', () => {
  const client: Client = new Client(
    jestGlobals.ACCOUNT_IDENTIFIER,
    jestGlobals.AUTH_KEY,
  );

  test('Deletes Uploaded File', async () => {
    const newFile = await client.upload(
      join(__dirname, './images/test-image.webp'),
      {
        metadata: {
          foo: 'bar',
        },
      },
    );

    await expect(client.delete(newFile.result.id)).resolves.toMatchObject({
      success: true,
    });

    await expect(client.delete(newFile.result.id)).rejects.toThrowError();
  });
});
