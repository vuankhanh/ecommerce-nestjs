export enum PurposeOfMedia {
  //Basic Promotional media
  LOGO = 'logo',
  SLIDE_SHOW = 'slide-show',
  PROMOTION = 'promotion',
  
  //Product
  PRODUCT = 'product',
  PRODUCT_CATEGORY = 'product-category',

  //Post
  POST = 'post',
  POST_CATEGORY = 'post-category',
}

export enum MediaFormat {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

export enum MediaMimeType {
  // Images
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  GIF = 'image/gif',
  
  // Videos
  MP4 = 'video/mp4',
  WEBM = 'video/webm',
  MOV = 'video/mov',
  
  // Documents
  PDF = 'application/pdf',
}