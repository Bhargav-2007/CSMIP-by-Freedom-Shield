const rawBasePath = import.meta.env.VITE_BASE_PATH || "/";

export const basePath =
  rawBasePath === "/"
    ? "/"
    : `/${rawBasePath.replace(/^\/+|\/+$/g, "")}/`;

export function withBasePath(path: string) {
  if (basePath === "/") {
    return path;
  }

  if (path === "/") {
    return basePath;
  }

  return `${basePath}${path.replace(/^\/+/, "")}`;
}