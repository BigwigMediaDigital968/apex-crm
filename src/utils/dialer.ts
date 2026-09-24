export const getSafeRecordingUrl = (url?: string): string => {
  if (!url) return "";

  // If it's a direct Stringee HTTP link, format it through backend proxy
  if (url.includes("stringee.com")) {
    const backendApi =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/v1";
    return `${backendApi}/dialer/recording-proxy?recordingUrl=${encodeURIComponent(url)}`;
  }

  return url;
};
