const Client = require('../dist/index').default;

const client = new Client(process.env.AUTH_ACCOUNT, process.env.AUTH_KEY);

client.list().then(async (r) => {
  console.log(`Deleting ${r.result.images.length} images`);
  await Promise.all(r.result.images.map((i) => client.delete(i.id)));
  console.log('Done');
});
