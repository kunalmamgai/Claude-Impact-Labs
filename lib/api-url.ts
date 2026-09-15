const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

export function apiUrl(path: string) {
  return backendOrigin ? `${backendOrigin}${path}` : path;
}
