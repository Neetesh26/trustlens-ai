export type RawScanData = {
  scripts: string[];
  forms: number;
  hasSSL: boolean;
} & {
  [key: string]: unknown; 
};