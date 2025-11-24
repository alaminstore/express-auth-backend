declare module "pdf-parse" {
  const pdf: (
    dataBuffer: Buffer
  ) => Promise<{ text: string; numpages: number; info: any }>;
  export default pdf;
}
