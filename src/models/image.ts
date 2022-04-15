import ImageMetadata from './image-metadata';

type Image = {
  id: string;
  filename: string;
  uploaded: string;
  requiredSignedURLs: boolean;
  variants: string[];
  meta?: ImageMetadata;
};

export default Image;
