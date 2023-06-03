import { existsSync, statSync } from "node:fs";

export const doesFolderExist = (path: string): boolean => {
  return existsSync(path) && statSync(path).isDirectory();
};