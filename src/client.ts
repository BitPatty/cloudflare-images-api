import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { createReadStream, ReadStream } from 'fs';

import DeletionResult from './models/deletion-result';
import DirectUploadUrlResponse from './models/direct-upload-url-response';
import FindImageResult from './models/find-image-result';
import ListResult from './models/list-result';
import UploadResult from './models/upload-result';

type ClientOptions = {
  baseUrlV1: string;
  baseUrlV2: string;
};

type UploadOptions = {
  metadata: Record<string, string>;
  requiredSignedURLs: boolean;
};

type DirectUploadOptions = {
  directUploadURL: string;
};

type DirectUploadUrlOptions = {
  metadata: Record<string, string>;
  requiredSignedURLs: boolean;
  expiry: string;
};

class Client {
  private options: ClientOptions = {
    baseUrlV1:
      'https://api.cloudflare.com/client/v4/accounts/<account_identifier>/images/v1',
    baseUrlV2:
      'https://api.cloudflare.com/client/v4/accounts/<account_identifier>/images/v1',
  };

  private getApiEndpoint(version = 1): string {
    return this.options[`baseUrlV${version}`].replace(
      '<account_identifier>',
      this.accountIdentifier,
    );
  }

  public constructor(
    private readonly accountIdentifier: string,
    private readonly authKey: string,
    options?: Partial<ClientOptions>,
  ) {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  private async cloudFlareCatcher<T>(
    req: () => Promise<AxiosResponse<T>>,
  ): Promise<T> {
    try {
      const { data } = await req();
      return data;
    } catch (err) {
      if (err?.response?.data?.success === false) return err.response.data;
      throw err;
    }
  }

  /**
   * Lists the images stored on CloudFlare
   *
   * @returns  The response
   */
  public list(): Promise<ListResult> {
    return this.cloudFlareCatcher(() =>
      axios.get<ListResult>(this.getApiEndpoint(), {
        headers: {
          Authorization: `Bearer ${this.authKey}`,
        },
      }),
    );
  }

  /**
   * Generates a direct upload URL
   *
   * @param options  The image options
   * @returns        The response containing the direct upload URL
   */
  public generateDirectUploadUrl(
    options?: DirectUploadUrlOptions,
  ): Promise<DirectUploadUrlResponse> {
    return this.cloudFlareCatcher(() =>
      axios.post(`${this.getApiEndpoint(2)}/direct_upload`, options, {
        headers: {
          Authorization: `Bearer ${this.authKey}`,
        },
      }),
    );
  }

  /**
   * Gets the image with the specified ID
   *
   * @param imageId  The image ID
   * @returns        The image response or NULL if it wasn't found
   */
  public async get(imageId: string): Promise<FindImageResult | null> {
    try {
      const result = await this.cloudFlareCatcher(() =>
        axios.get<FindImageResult>(`${this.getApiEndpoint()}/${imageId}`, {
          headers: { Authorization: `Bearer ${this.authKey}` },
        }),
      );

      return result;
    } catch (err) {
      if (err?.response?.status === 400) return null;
      throw err;
    }
  }

  /**
   * Deletes the image with the specified ID, throws if the
   * image doesn't exist
   *
   * @param imageId  The image ID
   * @returns        The deletion result
   */
  public delete(imageId: string): Promise<DeletionResult> {
    return this.cloudFlareCatcher(() =>
      axios.delete(`${this.getApiEndpoint()}/${imageId}`, {
        headers: { Authorization: `Bearer ${this.authKey}` },
      }),
    );
  }

  /**
   * Uploads the specified Image to CloudFlare
   *
   * @param source   The local path to the image or a stream/buffer containing the image
   * @param options  Optional upload options
   * @returns        The uploaded image data
   */
  public upload(
    source: string | ReadStream | Buffer,
    options?: Partial<UploadOptions> | Partial<DirectUploadOptions>,
  ): Promise<UploadResult> {
    const formData = new FormData();

    if (options)
      for (const e of Object.entries(options)) {
        if (e[0] !== nameof<DirectUploadOptions>((o) => o.directUploadURL))
          formData.append(e[0], JSON.stringify(e[1]));
      }

    const streamOrBuffer =
      typeof source === 'string' ? createReadStream(source) : source;

    formData.append('file', streamOrBuffer);

    return this.cloudFlareCatcher(() =>
      axios.post<UploadResult>(
        (options as DirectUploadOptions)?.directUploadURL ??
          this.getApiEndpoint(),
        formData,
        {
          headers: {
            Authorization: (options as DirectUploadOptions)?.directUploadURL
              ? ''
              : `Bearer ${this.authKey}`,
            ...formData.getHeaders(),
          },
        },
      ),
    );
  }
}

export default Client;
