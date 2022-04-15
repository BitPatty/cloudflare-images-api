type CloudFlareResponse<T> = {
  result: T;
  result_info: null;
  success: true;
  errors: [];
  messages: [];
};

export default CloudFlareResponse;
