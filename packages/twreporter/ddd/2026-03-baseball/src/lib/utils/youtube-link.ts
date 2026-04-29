export function getYouTubeEmbedUrl(url: string): string | null {
  const regExp: RegExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match: RegExpMatchArray | null = url.match(regExp);

  if (match && match[2].length === 11) {
    const videoId: string = match[2];
    const queryString: string = url.includes("?")
      ? "?" + url.split("?")[1]
      : "";
    return `https://www.youtube.com/embed/${videoId}${queryString}`;
  }

  return null; // Invalid URL
}
