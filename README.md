# Cloudflare Images API

A simple client to perform actions on the [Cloudflare Images](https://www.cloudflare.com/en-gb/products/cloudflare-images/) API.

## Install

The package can installed via npm

```sh
npm install @bitpatty/cloudflare-images-api
```

## Usage

1. Generate an [API Token](https://dash.cloudflare.com/profile/api-tokens) with the `Account.Cloudflare Images` permission.

2. Instantiate a new client with your account ID and your API Key

```typescript
import Client from '@bitpatty/cloudflare-images-api';

const client = new Client('your account id', 'your API key');
```

3. Use the client (see API docs at https://bitpatty.github.io/cloudflare-images-api)
