import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { createReadStream, ReadStream } from 'fs';
import DeletionResult from './models/deletion-result';
import FindImageResult from './models/find-image-result';
import ListResult from './models/list-result';
import UploadResult from './models/upload-result';

type ClientOptions = {
  baseUrl: string;
};

type UploadOptions = {
  metadata: Record<string, string>;
  requiredSignedURLs: boolean;
};

class Client {
  private options: ClientOptions = {
    baseUrl:
      'https://api.cloudflare.com/client/v4/accounts/<account_identifier>/images/v1',
  };

  private get apiEndpoint(): string {
    return this.options.baseUrl.replace(
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
      axios.get<ListResult>(this.apiEndpoint, {
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
        axios.get<FindImageResult>(`${this.apiEndpoint}/${imageId}`, {
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
      axios.delete(`${this.apiEndpoint}/${imageId}`, {
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
    options?: Partial<UploadOptions>,
  ): Promise<UploadResult> {
    const formData = new FormData();

    if (options)
      for (const e of Object.entries(options)) {
        formData.append(e[0], JSON.stringify(e[1]));
      }

    const streamOrBuffer =
      typeof source === 'string' ? createReadStream(source) : source;

    formData.append('file', streamOrBuffer);

    return this.cloudFlareCatcher(() =>
      axios.post<UploadResult>(this.apiEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${this.authKey}`,
          ...formData.getHeaders(),
        },
      }),
    );
  }
}

export default Client;
