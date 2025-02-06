import { vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';

// Setup globals that might be needed
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock process.exit
const processExit = process.exit;
vi.spyOn(process, 'exit').mockImplementation((code?: number) => {
  console.log(`Process.exit called with code: ${code}`);
  return undefined as never;
});

// Cleanup
afterAll(() => {
  process.exit = processExit;
});
