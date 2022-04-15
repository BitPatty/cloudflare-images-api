import CloudFlareResponse from './cloudflare-response';
import Image from './image';

type ListResult = CloudFlareResponse<{ images: Image[] }>;

export default ListResult;
