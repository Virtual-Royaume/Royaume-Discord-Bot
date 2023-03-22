export type CodeElement = {
  link: string;

  lines: number[];
  mainLine?: number;

  code: string;
  fileExtension: string;
}