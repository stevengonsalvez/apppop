import { vi, afterAll } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';

// Setup globals that might be needed
global.TextEncoder = TextEncoder;
// @ts-expect-error TextDecoder has slightly different types between Node and DOM
global.TextDecoder = TextDecoder;

// Mock process.exit
const processExit = process.exit;
vi.spyOn(process, 'exit').mockImplementation((code?: number | string | null) => {
  console.log(`Process.exit called with code: ${code}`);
  return undefined as never;
});

// Cleanup
afterAll(() => {
  process.exit = processExit;
});
