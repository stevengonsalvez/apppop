#!/usr/bin/env node

import { execSync } from 'child_process';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATE_REPO = 'https://github.com/stevengonsalvez/apppop.git';

const checkPrerequisites = (): void => {
  const spinner = ora('Checking prerequisites...').start();
  try {
    ['node', 'npm', 'git'].forEach(cmd => {
      try {
        execSync(`command -v ${cmd}`, { stdio: 'ignore' });
      } catch {
        spinner.fail(`${cmd} is not installed. Please install it first.`);
        process.exit(1);
      }
    });
    spinner.succeed('Prerequisites check passed');
  } catch (error) {
    spinner.fail('Prerequisites check failed');
    console.error(error);
    process.exit(1);
  }
};

export interface ProjectConfig {
  projectName: string;
  projectDir: string;
  setupOptions: SetupOptions;
}

export interface SetupOptions {
  includeSupabase: boolean;
  includeAnalytics: boolean;
  includeThemeSystem: boolean;
  includeErrorTracking: boolean;
}

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseProjectId: string;
}

export const validateSupabaseUrl = (url: string): boolean => {
  const urlPattern = /^https:\/\/[a-z0-9-]+\.supabase\.co$/;
  if (!urlPattern.test(url)) {
    console.log(chalk.red('\n⚠️  Warning: The Supabase URL format appears incorrect'));
    console.log(chalk.yellow('Expected format: https://your-project.supabase.co'));
    console.log(chalk.yellow('Received: ' + url));
    return false;
  }
  return true;
};

export const validateSupabaseKey = (key: string): boolean => {
  const keyPattern = /^eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  if (!keyPattern.test(key)) {
    console.log(chalk.red('\n⚠️  Warning: The anon key format appears incorrect'));
    console.log(chalk.yellow('Expected format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'));
    console.log(chalk.yellow('Received: ' + key));
    return false;
  }
  return true;
};

export const validateProjectId = (id: string): boolean => {
  const idPattern = /^[a-zA-Z0-9]{20,}$/;
  if (!idPattern.test(id)) {
    console.log(chalk.red('\n⚠️  Warning: The project ID format appears incorrect'));
    console.log(chalk.yellow('Expected format: A string of at least 20 letters and numbers'));
    console.log(chalk.yellow('Received: ' + id));
    return false;
  }
  return true;
};

const getSetupOptions = async (): Promise<SetupOptions> => {
  console.log(chalk.cyan('\nSetup Options'));
  console.log(chalk.dim('Select which features you want to include in your project:'));

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'includeSupabase',
      message: 'Include Supabase setup? (Authentication, Database)',
      default: true,
    },
    {
      type: 'confirm',
      name: 'includeAnalytics',
      message: 'Include Analytics setup? (Google Analytics, Microsoft Clarity)',
      default: true,
    },
    {
      type: 'confirm',
      name: 'includeThemeSystem',
      message: 'Include Theme System setup?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'includeErrorTracking',
      message: 'Include Error Tracking setup? (Sentry)',
      default: true,
    },
  ]);

  return answers;
};

export const createProjectStructure = async (): Promise<ProjectConfig> => {
  console.log(chalk.bold('\n1. Project Configuration'));

  const projectAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter project name:',
      default: 'my-apppop-app',
    },
    {
      type: 'input',
      name: 'projectDir',
      message: 'Enter directory to create project in:',
      default: (answers: { projectName: string }) => `./${answers.projectName}`,
    },
  ]);

  const setupOptions = await getSetupOptions();

  const spinner = ora('Creating project structure...').start();
  try {
    await mkdir(projectAnswers.projectDir, { recursive: true });
    process.chdir(projectAnswers.projectDir);
    spinner.succeed('Project structure created');
    return { ...projectAnswers, setupOptions };
  } catch (error) {
    spinner.fail('Failed to create project structure');
    console.error(error);
    process.exit(1);
  }
};

export const configureSupabase = async (): Promise<SupabaseConfig> => {
  console.log(chalk.bold('\n2. Supabase Configuration'));
  console.log(
    chalk.yellow(
      "\nPlease create a new Supabase project at https://app.supabase.com if you haven't already."
    )
  );

  // ASCII diagram for the Supabase dashboard
  console.log(chalk.cyan('\nSupabase Dashboard Navigation:'));
  console.log(
    chalk.dim(`
    +------------------------------------------------------+
    |   ${chalk.cyan('Supabase Dashboard')}                                 |
    +------------------------------------------------------+
    | Project: MyProject                   [Switch Project] |
    |------------------------------------------------------|
    |                                                      |
    | [🏠] Home        [⚙️] Settings    [?] Help           |
    |                                                      |
    | Navigation                      Project Settings      |
    | ├─ Table Editor                 ├─ General           |
    | ├─ Authentication              >├─ API              |
    | ├─ Storage                     >├─ Database         |
    | ├─ Edge Functions              >└─ Authentication   |
    | └─ SQL Editor                                       |
    |                                                      |
    +------------------------------------------------------+
  `)
  );

  console.log(chalk.cyan('\n1. Project URL:'));
  console.log('   • Open your project in Supabase dashboard');
  console.log('   • Go to Project Settings (⚙️ icon in top navigation)');
  console.log('   • Look under "Project Configuration" -> "Project URL"');

  // ASCII diagram for Project URL location
  console.log(
    chalk.dim(`
    +------------------------------------------------------+
    |   ${chalk.cyan('Project Settings > Project Configuration')}           |
    +------------------------------------------------------+
    | ${chalk.yellow('Project Configuration')}                                  |
    |------------------------------------------------------|
    | Project Name: MyProject                               |
    |                                                      |
    | ${chalk.green('Project URL:')}                                          |
    | ${chalk.green('[https://xxx.supabase.co]')}  [📋 Copy]                 |
    |                                                      |
    | Region: West US 2 (Washington)                       |
    |                                                      |
    | Database Password: ********                          |
    |                                                      |
    +------------------------------------------------------+
  `)
  );

  let supabaseUrl: string | undefined;
  while (!supabaseUrl) {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'url',
          message: 'Enter Supabase Project URL:',
          default: 'https://your-project-url.supabase.co',
          validate: (input: string) => {
            const isValid = validateSupabaseUrl(input);
            if (!isValid) {
              return 'Please enter a valid Supabase URL';
            }
            return true;
          },
        },
      ]);
      supabaseUrl = answer.url;
    } catch (error) {
      console.error('Error during input:', error);
    }
  }

  console.log(chalk.cyan('\n2. Anon/Public Key:'));
  console.log('   • Stay in Project Settings');
  console.log('   • Go to "API" section in the sidebar');
  console.log('   • Look under "Project API keys"');
  console.log('   • Copy the "anon public" key (NOT the service_role key!)');

  // ASCII diagram for API key location
  console.log(
    chalk.dim(`
    +------------------------------------------------------+
    |   ${chalk.cyan('Project Settings > API')}                              |
    +------------------------------------------------------+
    | ${chalk.yellow('Project API Keys')}                                     |
    |------------------------------------------------------|
    | These keys are safe to use in a browser if you've    |
    | configured Row Level Security (RLS).                  |
    |                                                      |
    | ${chalk.green('Project API Keys')}                                     |
    | ┌────────────────────────────────────────┐          |
    | │ anon public                            │          |
    | │ ${chalk.green('eyJhbG...')}                    [📋 Copy] │          |
    | └────────────────────────────────────────┘          |
    |                                                      |
    | ${chalk.red('⚠️  Secret Keys (DO NOT SHARE!)')}                       |
    | ┌────────────────────────────────────────┐          |
    | │ service_role                           │          |
    | │ ey********                     [Show]  │          |
    | └────────────────────────────────────────┘          |
    +------------------------------------------------------+
  `)
  );

  let supabaseAnonKey: string | undefined;
  while (!supabaseAnonKey) {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'key',
          message: 'Enter Supabase Anon Key:',
          default: 'your-anon-key',
          validate: (input: string) => {
            const isValid = validateSupabaseKey(input);
            if (!isValid) {
              return 'Please enter a valid Supabase anon key';
            }
            return true;
          },
        },
      ]);
      supabaseAnonKey = answer.key;
    } catch (error) {
      console.error('Error during input:', error);
    }
  }

  console.log(chalk.cyan('\n3. Project ID:'));
  console.log('   • Go to "General" settings in the sidebar');
  console.log('   • Find "Reference ID" under Project Settings');
  console.log('   • This is used for CLI configuration and API access');

  // ASCII diagram for Project ID location
  console.log(
    chalk.dim(`
    +------------------------------------------------------+
    |   ${chalk.cyan('Project Settings > General')}                          |
    +------------------------------------------------------+
    | ${chalk.yellow('General Settings')}                                     |
    |------------------------------------------------------|
    | Project Info                                         |
    | ├─ Name: MyProject                                  |
    | ├─ Region: West US 2                                |
    | │                                                   |
    | ${chalk.green('Reference ID (Project ID)')}                            |
    | ├─ ${chalk.green('abcdef123456789...')}                [📋 Copy]       |
    | │                                                   |
    | Database                                           |
    | ├─ Host: db.xxx.supabase.co                       |
    | ├─ Password: ********                              |
    | └─ Port: 5432                                      |
    +------------------------------------------------------+
  `)
  );

  let supabaseProjectId: string | undefined;
  while (!supabaseProjectId) {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'id',
          message: 'Enter Supabase Project ID:',
          default: 'your-project-id',
          validate: (input: string) => {
            const isValid = validateProjectId(input);
            if (!isValid) {
              return 'Please enter a valid Supabase project ID';
            }
            return true;
          },
        },
      ]);
      supabaseProjectId = answer.id;
    } catch (error) {
      console.error('Error during input:', error);
    }
  }

  return { supabaseUrl, supabaseAnonKey, supabaseProjectId };
};

export const cloneTemplate = (projectDir: string): void => {
  const spinner = ora('Cloning template repository...').start();
  try {
    execSync(`git clone --depth 1 ${TEMPLATE_REPO} ${projectDir}`, {
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf-8',
    });

    process.chdir(projectDir);

    const tenantReadmePath = join(__dirname, '..', 'tenant_readme.md');
    const setupPath = join(__dirname, '..', 'setup.md');

    execSync(`cp ${tenantReadmePath} README.md`, { stdio: 'ignore' });
    execSync(`cp ${setupPath} docs/setup.md`, { stdio: 'ignore' });

    execSync('rm -rf .git', { stdio: 'ignore' });
    execSync('rm -rf .claudesync', { stdio: 'ignore' });
    spinner.succeed('Template repository cloned and cleaned');
  } catch (error) {
    spinner.fail('Failed to clone template');
    if (error instanceof Error) {
      console.error(chalk.red('\nError details:'));
      // @ts-expect-error execSync error has stderr property
      if (error.stderr) console.error(chalk.yellow(error.stderr));
      // @ts-expect-error execSync error has stdout property
      if (error.stdout) console.error(chalk.yellow(error.stdout));
    }
    console.error(chalk.cyan('\nPossible solutions:'));
    console.error(chalk.dim('1. Check if the repository exists: ' + TEMPLATE_REPO));
    console.error(chalk.dim('2. Check your internet connection'));
    console.error(chalk.dim('3. Check if the target directory already exists'));
    process.exit(1);
  }
};

const initializeGit = (): void => {
  const spinner = ora('Initializing git...').start();
  try {
    execSync('git init', { stdio: 'ignore' });
    execSync('git add .', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit from AppPop template"', { stdio: 'ignore' });
    spinner.succeed('Git repository initialized');
  } catch (error) {
    spinner.fail('Failed to initialize git');
    console.error(error);
    process.exit(1);
  }
};

const updateProjectFiles = async (
  projectName: string,
  supabaseConfig?: SupabaseConfig
): Promise<void> => {
  const spinner = ora('Updating project files...').start();
  try {
    const filesToUpdate = [
      'package.json',
      'README.md',
      'index.html',
      'vite.config.ts',
      '.env',
      '.env.example',
      'capacitor.config.ts',
    ];

    // Only include Supabase config if Supabase is enabled
    if (supabaseConfig) {
      filesToUpdate.push('supabase/config.toml');
    }

    for (const file of filesToUpdate) {
      try {
        const content = await readFile(file, 'utf8');
        let updatedContent = content;

        if (file === 'capacitor.config.ts') {
          updatedContent = content
            .replace(
              /appId: ['"]com\.apppop\.app['"]/g,
              `appId: 'com.${projectName.toLowerCase()}.app'`
            )
            .replace(
              /appName: ['"]AppPop['"]/g,
              `appName: '${projectName.charAt(0).toUpperCase() + projectName.slice(1).toLowerCase()}'`
            );
        } else if (file === 'supabase/config.toml' && supabaseConfig) {
          updatedContent = content
            .replace(/project_id = ".*"/g, `project_id = "${supabaseConfig.supabaseProjectId}"`)
            .replace(/name = "apppop"/g, `name = "${projectName.toLowerCase()}"`);
        } else {
          updatedContent = content
            .replace(/apppop/g, projectName.toLowerCase())
            .replace(
              /AppPop/g,
              projectName.charAt(0).toUpperCase() + projectName.slice(1).toLowerCase()
            );
        }

        await writeFile(file, updatedContent);
      } catch (err: unknown) {
        if (err instanceof Error && 'code' in err && err.code !== 'ENOENT') {
          throw err;
        }
      }
    }

    spinner.succeed('Project files updated');
  } catch (error) {
    spinner.fail('Failed to update project files');
    console.error(error);
    process.exit(1);
  }
};

export const setupEnvironment = async (
  projectName: string,
  setupOptions: SetupOptions,
  supabaseConfig?: SupabaseConfig
): Promise<void> => {
  const spinner = ora('Setting up environment variables...').start();
  try {
    let envContent = `# Environment Variables for ${projectName}
# ⚠️  WARNING: NEVER commit this file to version control
# ⚠️  WARNING: Keep this file secure and private

# App Configuration
VITE_APP_NAME=${projectName}
`;

    let envExampleContent = `# Example Environment Variables for ${projectName}
# Copy this file to .env and fill in your values

# App Configuration
VITE_APP_NAME=${projectName}
`;

    if (setupOptions.includeSupabase && supabaseConfig) {
      envContent += `
# Supabase Configuration
VITE_APP_SUPABASE_URL=${supabaseConfig.supabaseUrl}
VITE_APP_SUPABASE_ANON_KEY=${supabaseConfig.supabaseAnonKey}
`;
      envExampleContent += `
# Supabase Configuration
VITE_APP_SUPABASE_URL=https://your-project.supabase.co
VITE_APP_SUPABASE_ANON_KEY=your-anon-key
`;
    }

    if (setupOptions.includeAnalytics) {
      envContent += `
# Analytics & Monitoring
VITE_CLARITY_TRACKING_CODE=  # Microsoft Clarity
VITE_GTM_CONTAINER_ID=       # Google Tag Manager
VITE_GA4_MEASUREMENT_ID=     # Google Analytics 4
`;
      envExampleContent += `
# Analytics & Monitoring
VITE_CLARITY_TRACKING_CODE=xxxxxxxx
VITE_GTM_CONTAINER_ID=GTM-XXXXXX
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
`;
    }

    if (setupOptions.includeErrorTracking) {
      envContent += `
# Error Tracking
VITE_SENTRY_DSN=            # Sentry Error Tracking
`;
      envExampleContent += `
# Error Tracking
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
`;
    }

    await writeFile('.env', envContent);
    await writeFile('.env.example', envExampleContent);

    const gitignorePath = '.gitignore';
    try {
      const gitignoreContent = await readFile(gitignorePath, 'utf8');
      if (!gitignoreContent.includes('.env')) {
        await writeFile(
          gitignorePath,
          gitignoreContent + '\n# Environment Variables\n.env\n.env.local\n.env.*.local\n'
        );
      }
    } catch (err) {
      await writeFile(gitignorePath, '# Environment Variables\n.env\n.env.local\n.env.*.local\n');
    }

    spinner.succeed('Environment files created and .gitignore updated');
  } catch (error) {
    spinner.fail('Failed to create environment files');
    console.error(error);
    process.exit(1);
  }
};

const installDependencies = (): void => {
  const spinner = ora('Installing dependencies...').start();
  try {
    execSync('npm install', { stdio: 'ignore' });
    spinner.succeed('Dependencies installed');
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    console.error(error);
    process.exit(1);
  }
};

const setupSupabaseCLI = (): void => {
  const spinner = ora('Setting up Supabase CLI...').start();
  try {
    execSync('npm install supabase --save-dev', { stdio: 'ignore' });
    execSync('npx supabase init', { stdio: 'ignore' });
    spinner.succeed('Supabase CLI setup complete');
  } catch (error) {
    spinner.fail('Failed to setup Supabase CLI');
    console.error(error);
    process.exit(1);
  }
};

const showFinalInstructions = (projectDir: string, setupOptions: SetupOptions): void => {
  console.log(chalk.green('\n✅ Project setup complete!'));
  console.log('\nNext steps:');
  console.log(`1. cd ${projectDir}`);
  console.log('2. Review and update package.json with your project details');

  if (setupOptions.includeSupabase) {
    console.log('3. Configure Authentication:');
    console.log('   • Check Auth.md in your project root for detailed setup instructions');
    console.log('   • Set up email verification');
    console.log('   • Configure SMTP for auth emails');
    console.log('   • Implement security best practices');
  }

  if (setupOptions.includeThemeSystem) {
    console.log('4. Configure Theme System:');
    console.log('   • Review theme-system.md for complete theming guide');
    console.log('   • Choose from available color schemes:');
    console.log('     - default (Classic blue Material Design)');
    console.log('     - indigo (Deep purple and pink accents)');
    console.log('     - emerald (Nature-inspired green)');
    console.log('     - sunset (Warm orange and yellow)');
    console.log('     - ocean (Calming blue tones)');
    console.log('   • Select font scheme:');
    console.log('     - modern (Inter font)');
    console.log('     - classic (Roboto/Roboto Slab)');
    console.log('     - minimal (System fonts)');
  }

  console.log("5. Run 'npm run dev' to start the development server");

  if (setupOptions.includeAnalytics || setupOptions.includeErrorTracking) {
    console.log('6. Set up additional services:');
    if (setupOptions.includeAnalytics) {
      console.log('   - Microsoft Clarity for analytics');
      console.log('   - Google Tag Manager for analytics');
    }
    if (setupOptions.includeErrorTracking) {
      console.log('   - Sentry for error monitoring');
    }
  }

  if (setupOptions.includeSupabase) {
    console.log(chalk.cyan('\nImportant Security Reminder:'));
    console.log('• Review Auth.md for security best practices');
    console.log('• Set up Row Level Security (RLS) policies');
    console.log('• Configure proper email verification');
    console.log('• Never commit sensitive keys or .env files');
  }

  if (setupOptions.includeThemeSystem) {
    console.log(chalk.cyan('\nTheming Quick Reference:'));
    console.log('• Theme system supports both light and dark modes');
    console.log('• Each color scheme includes:');
    console.log('  - Primary, Secondary, and Tertiary colors');
    console.log('  - Background and surface variants');
    console.log('  - Text colors and state colors');
    console.log('• Font system includes:');
    console.log('  - Multiple weights (light to bold)');
    console.log('  - Configurable letter spacing');
    console.log('  - Primary and secondary font families');
  }

  console.log(chalk.bold('\nHappy coding! 🎉'));
};

const main = async (): Promise<void> => {
  console.log(chalk.bold.green('\nWelcome to AppPop Project Creator! 🚀\n'));

  try {
    checkPrerequisites();
    const { projectName, projectDir, setupOptions } = await createProjectStructure();

    let supabaseConfig: SupabaseConfig | undefined;
    if (setupOptions.includeSupabase) {
      supabaseConfig = await configureSupabase();
    }

    cloneTemplate(projectDir);
    initializeGit();
    await updateProjectFiles(projectName, supabaseConfig);
    await setupEnvironment(projectName, setupOptions, supabaseConfig);
    installDependencies();

    if (setupOptions.includeSupabase) {
      setupSupabaseCLI();
    }

    showFinalInstructions(projectDir, setupOptions);
  } catch (error) {
    console.error(chalk.red('\nAn error occurred:'), error);
    process.exit(1);
  }
};

// Ensure we handle the promise rejection
main().catch(error => {
  console.error(chalk.red('\nUnexpected error:'), error);
  process.exit(1);
});
