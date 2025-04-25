interface Window {
  uploadToCloudflareImages: (
    file: File,
    accountId: string,
    apiToken: string
  ) => Promise<{
    success: boolean;
    url: string;
    id: string;
  }>;
}
