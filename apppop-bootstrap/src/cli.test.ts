import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create a spinner mock factory
const createSpinnerMock = () => ({
  start: vi.fn().mockReturnThis(),
  succeed: vi.fn().mockReturnThis(),
  fail: vi.fn().mockReturnThis(),
});

// Mock modules before importing the code that uses them
vi.mock('child_process');
vi.mock('fs/promises');
vi.mock('inquirer');
vi.mock('ora', () => {
  return {
    __esModule: true,
    default: (text: string) => createSpinnerMock(),
  };
});
vi.mock('chalk', () => ({
  default: {
    bold: vi.fn(str => str),
    green: vi.fn(str => str),
    red: vi.fn(str => str),
    yellow: vi.fn(str => str),
    cyan: vi.fn(str => str),
    dim: vi.fn(str => str),
  },
}));

// Import after mocking
import { execSync } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import inquirer from 'inquirer';
import {
  validateSupabaseUrl,
  validateSupabaseKey,
  validateProjectId,
  createProjectStructure,
  configureSupabase,
  setupEnvironment,
  cloneTemplate,
} from './index';

describe('CLI Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock process.chdir to prevent actually changing directories
    vi.spyOn(process, 'chdir').mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('validateSupabaseUrl', () => {
    it('should validate correct Supabase URL format', () => {
      expect(validateSupabaseUrl('https://example.supabase.co')).toBe(true);
      expect(validateSupabaseUrl('https://my-project.supabase.co')).toBe(true);
    });

    it('should reject invalid Supabase URL format', () => {
      expect(validateSupabaseUrl('http://example.supabase.co')).toBe(false);
      expect(validateSupabaseUrl('https://example.com')).toBe(false);
      expect(validateSupabaseUrl('invalid-url')).toBe(false);
    });
  });

  describe('validateSupabaseKey', () => {
    it('should validate correct Supabase key format', () => {
      expect(validateSupabaseKey('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example')).toBe(true);
    });

    it('should reject invalid Supabase key format', () => {
      expect(validateSupabaseKey('invalid-key')).toBe(false);
      expect(validateSupabaseKey('123456')).toBe(false);
    });
  });

  describe('createProjectStructure', () => {
    it('should create project structure successfully', async () => {
      // Mock inquirer responses
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        projectName: 'test-project',
        projectDir: './test-project',
      });

      // Mock getSetupOptions response
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        includeSupabase: true,
        includeAnalytics: true,
        includeThemeSystem: true,
        includeErrorTracking: true,
      });

      // Mock mkdir to succeed
      vi.mocked(mkdir).mockResolvedValueOnce(undefined);

      const result = await createProjectStructure();

      expect(result).toEqual({
        projectName: 'test-project',
        projectDir: './test-project',
        setupOptions: {
          includeSupabase: true,
          includeAnalytics: true,
          includeThemeSystem: true,
          includeErrorTracking: true,
        },
      });

      expect(mkdir).toHaveBeenCalledWith('./test-project', { recursive: true });
      expect(process.chdir).toHaveBeenCalledWith('./test-project');
    });

    it('should handle project creation failure', async () => {
      // Mock inquirer responses for both prompts
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({
          projectName: 'test-project',
          projectDir: './test-project',
        })
        .mockResolvedValueOnce({
          includeSupabase: true,
          includeAnalytics: true,
          includeThemeSystem: true,
          includeErrorTracking: true,
        });

      // Mock mkdir to fail
      vi.mocked(mkdir).mockRejectedValueOnce(new Error('Failed to create directory'));

      // Mock process.exit to throw instead of exiting
      const mockExit = vi.spyOn(process, 'exit').mockImplementation((code?: number) => {
        throw new Error(`Process exit with code: ${code}`);
      });

      await expect(createProjectStructure()).rejects.toThrow('Process exit with code: 1');

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('configureSupabase', () => {
    it('should configure Supabase successfully', async () => {
      const mockSupabaseConfig = {
        url: 'https://example.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example',
        id: 'abcdefghijklmnopqrst',
      };

      // Mock the three prompts for URL, key, and project ID
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ url: mockSupabaseConfig.url })
        .mockResolvedValueOnce({ key: mockSupabaseConfig.key })
        .mockResolvedValueOnce({ id: mockSupabaseConfig.id });

      const result = await configureSupabase();

      expect(result).toEqual({
        supabaseUrl: mockSupabaseConfig.url,
        supabaseAnonKey: mockSupabaseConfig.key,
        supabaseProjectId: mockSupabaseConfig.id,
      });
    });
  });

  describe('setupEnvironment', () => {
    it('should create environment files with Supabase config', async () => {
      const projectName = 'test-project';
      const setupOptions = {
        includeSupabase: true,
        includeAnalytics: true,
        includeThemeSystem: true,
        includeErrorTracking: true,
      };
      const supabaseConfig = {
        supabaseUrl: 'https://example.supabase.co',
        supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example',
        supabaseProjectId: 'abcdefghijklmnopqrst',
      };

      await setupEnvironment(projectName, setupOptions, supabaseConfig);

      expect(writeFile).toHaveBeenCalledTimes(3); // .env, .env.example, and .gitignore
      
      // Verify .env content
      const envCall = vi.mocked(writeFile).mock.calls.find(call => call[0] === '.env');
      expect(envCall?.[1]).toContain('VITE_APP_NAME=test-project');
      expect(envCall?.[1]).toContain('VITE_APP_SUPABASE_URL=https://example.supabase.co');
      
      // Verify .gitignore was updated
      const gitignoreCall = vi.mocked(writeFile).mock.calls.find(call => call[0] === '.gitignore');
      expect(gitignoreCall?.[1]).toContain('.env');
    });
  });

  describe('cloneTemplate', () => {
    it('should clone template repository successfully', () => {
      vi.mocked(execSync).mockImplementation(() => Buffer.from(''));

      cloneTemplate('./test-project');

      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('git clone --depth 1'),
        expect.any(Object)
      );
      expect(process.chdir).toHaveBeenCalledWith('./test-project');
    });

    it('should handle clone failure', () => {
      // Mock execSync to throw
      vi.mocked(execSync).mockImplementationOnce(() => {
        throw new Error('Clone failed');
      });

      // Mock process.exit to throw instead of exiting
      const mockExit = vi.spyOn(process, 'exit').mockImplementation((code?: number) => {
        throw new Error(`Process exit with code: ${code}`);
      });

      expect(() => cloneTemplate('./test-project')).toThrow('Process exit with code: 1');

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
}); 