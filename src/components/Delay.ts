export const delay = (ms: number): Promise<void> => new Promise<void>(res => setTimeout(res, ms));
