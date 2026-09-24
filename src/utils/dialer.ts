export const getSafeRecordingUrl = (url?: string): string => {
  if (!url) return "";

  if (url.includes("stringee.com")) {
    const backendApi = import.meta.env.VITE_API_URL;
    return `${backendApi}/dialer/recording-proxy?recordingUrl=${encodeURIComponent(url)}`;
  }

  return url;
};
