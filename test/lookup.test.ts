import { join } from 'path';
import jestGlobals from '../jest.globals';
import Client from '../src';

describe('Image Lookup', () => {
  const client: Client = new Client(
    jestGlobals.ACCOUNT_IDENTIFIER,
    jestGlobals.AUTH_KEY,
  );

  test('Lists Uploaded Files', async () => {
    await client.upload(join(__dirname, './images/test-image.webp'), {
      metadata: {
        foo: 'bar',
      },
    });

    const list = await client.list();
    expect(list.result.images.length).toBeGreaterThan(0);
  });

  test('Finds Uploaded Image', async () => {
    const image = await client.upload(
      join(__dirname, './images/test-image.webp'),
      {
        metadata: {
          foo: 'bar',
        },
      },
    );

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));

    // eslint-disable-next-line
    // @ts-ignore
    delete image.result.uploaded;

    await expect(client.get(image.result.id)).resolves.toMatchObject({
      result: image.result,
    });
  });

  test('Returns NULL For Invalid ID', async () => {
    await expect(client.get('some-id')).resolves.toBeNull();
  });
});
