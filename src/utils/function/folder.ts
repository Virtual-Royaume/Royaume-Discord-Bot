import { existsSync, statSync } from "fs";

export const doesFolderExist = (path: string): boolean => {
  return existsSync(path) && statSync(path).isDirectory();
};