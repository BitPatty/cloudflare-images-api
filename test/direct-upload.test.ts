import { join } from 'path';

import jestGlobals from '../jest.globals';
import Client from '../src';

describe('Direct Upload', () => {
  const client: Client = new Client(
    jestGlobals.ACCOUNT_IDENTIFIER,
    jestGlobals.AUTH_KEY,
  );

  test('Generates Direct Upload URL', async () => {
    const result = await client.generateDirectUploadUrl();
    expect(result.success).toEqual(true);
    expect(result.result.id).toBeDefined();
    expect(result.result.uploadURL).toBeDefined();
    expect(result.result.uploadURL.length).toBeGreaterThan(0);
  });

  test('Uploads Image To Direct Upload URL', async () => {
    const ctx = await client.generateDirectUploadUrl();

    await expect(
      client.upload(join(__dirname, './images/test-image.webp'), {
        directUploadURL: ctx.result.uploadURL,
      }),
    ).resolves.toMatchObject({
      success: true,
    });
  });
});
