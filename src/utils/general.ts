export const extractURLDomain = (url: string | undefined) => {
  if (!url) return undefined;
  const splited = url.split('/');
  if (splited.length < 3) return undefined;
  return splited[2];
}