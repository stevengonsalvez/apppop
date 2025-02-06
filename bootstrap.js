#!/usr/bin/env node

import { execSync } from 'child_process';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { createInterface } from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (question) => new Promise((resolve) => rl.question(question, resolve));

const promptWithDefault = async (question, defaultValue) => {
  const answer = await prompt(chalk.blue(`${question} `) + chalk.dim(`(default: ${defaultValue}): `));
  return answer.trim() || defaultValue;
};

const checkPrerequisites = () => {
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

const createProjectStructure = async () => {
  console.log(chalk.bold('\n1. Project Configuration'));
  const projectName = await promptWithDefault('Enter project name:', 'my-apppop-app');
  const projectDir = await promptWithDefault('Enter directory to create project in:', `./${projectName}`);

  const spinner = ora('Creating project structure...').start();
  try {
    await mkdir(projectDir, { recursive: true });
    process.chdir(projectDir);
    spinner.succeed('Project structure created');
    return { projectName, projectDir };
  } catch (error) {
    spinner.fail('Failed to create project structure');
    console.error(error);
    process.exit(1);
  }
};

const initializeGit = () => {
  console.log(chalk.bold('\n2. Initializing Git Repository'));
  const spinner = ora('Initializing git...').start();
  try {
    execSync('git init', { stdio: 'ignore' });
    spinner.succeed('Git repository initialized');
  } catch (error) {
    spinner.fail('Failed to initialize git');
    console.error(error);
    process.exit(1);
  }
};

const validateSupabaseUrl = (url) => {
  const urlPattern = /^https:\/\/[a-z0-9-]+\.supabase\.co$/;
  if (!urlPattern.test(url)) {
    console.log(chalk.red('\n⚠️  Warning: The Supabase URL format appears incorrect'));
    console.log(chalk.yellow('Expected format: https://your-project.supabase.co'));
    console.log(chalk.yellow('Received: ' + url));
    return false;
  }
  return true;
};

const validateSupabaseKey = (key) => {
  // Anon key format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  const keyPattern = /^eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  if (!keyPattern.test(key)) {
    console.log(chalk.red('\n⚠️  Warning: The anon key format appears incorrect'));
    console.log(chalk.yellow('Expected format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'));
    console.log(chalk.yellow('Received: ' + key));
    return false;
  }
  return true;
};

const validateProjectId = (id) => {
  // Project ID format: typically a long string of letters and numbers
  const idPattern = /^[a-zA-Z0-9]{20,}$/;
  if (!idPattern.test(id)) {
    console.log(chalk.red('\n⚠️  Warning: The project ID format appears incorrect'));
    console.log(chalk.yellow('Expected format: A string of at least 20 letters and numbers'));
    console.log(chalk.yellow('Received: ' + id));
    return false;
  }
  return true;
};

const configureSupabase = async () => {
  console.log(chalk.bold('\n3. Supabase Configuration'));
  console.log(chalk.yellow('\nPlease create a new Supabase project at https://app.supabase.com if you haven\'t already.'));
  
  // ASCII diagram for the Supabase dashboard
  console.log(chalk.cyan('\nSupabase Dashboard Navigation:'));
  console.log(chalk.dim(`
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
  `));

  console.log(chalk.cyan('\n1. Project URL:'));
  console.log('   • Open your project in Supabase dashboard');
  console.log('   • Go to Project Settings (⚙️ icon in top navigation)');
  console.log('   • Look under "Project Configuration" -> "Project URL"');
  
  // ASCII diagram for Project URL location
  console.log(chalk.dim(`
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
  `));
  
  let supabaseUrl;
  do {
    supabaseUrl = await promptWithDefault(
      'Enter Supabase Project URL:',
      'https://your-project-url.supabase.co'
    );
  } while (!validateSupabaseUrl(supabaseUrl) && 
           !await promptWithDefault('Continue with this URL anyway? (yes/no):', 'no').then(answer => answer.toLowerCase() === 'yes'));

  console.log(chalk.cyan('\n2. Anon/Public Key:'));
  console.log('   • Stay in Project Settings');
  console.log('   • Go to "API" section in the sidebar');
  console.log('   • Look under "Project API keys"');
  console.log('   • Copy the "anon public" key (NOT the service_role key!)');
  
  // ASCII diagram for API key location
  console.log(chalk.dim(`
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
  `));

  let supabaseAnonKey;
  do {
    supabaseAnonKey = await promptWithDefault(
      'Enter Supabase Anon Key:',
      'your-anon-key'
    );
  } while (!validateSupabaseKey(supabaseAnonKey) &&
           !await promptWithDefault('Continue with this key anyway? (yes/no):', 'no').then(answer => answer.toLowerCase() === 'yes'));

  console.log(chalk.cyan('\n3. Project ID:'));
  console.log('   • Go to "General" settings in the sidebar');
  console.log('   • Find "Reference ID" under Project Settings');
  console.log('   • This is used for CLI configuration and API access');
  
  // ASCII diagram for Project ID location
  console.log(chalk.dim(`
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
  `));

  let supabaseProjectId;
  do {
    supabaseProjectId = await promptWithDefault(
      'Enter Supabase Project ID:',
      'your-project-id'
    );
  } while (!validateProjectId(supabaseProjectId) &&
           !await promptWithDefault('Continue with this project ID anyway? (yes/no):', 'no').then(answer => answer.toLowerCase() === 'yes'));

  return { supabaseUrl, supabaseAnonKey, supabaseProjectId };
};

const TEMPLATE_REPO = 'https://github.com/stevengonsalvez/apppop.git';

const cloneTemplate = async () => {
  console.log(chalk.bold('\n4. Setting up project template'));
  const spinner = ora('Cloning template...').start();
  
  try {
    // Clone the template repository
    execSync(`git clone ${TEMPLATE_REPO} temp --depth 1`, { stdio: 'ignore' });
    
    // Remove the template's git history
    execSync('rm -rf temp/.git', { stdio: 'ignore' });
    
    // Copy all files including hidden ones, but exclude certain files
    execSync('cp -r temp/. .', { stdio: 'ignore' });
    
    // Clean up temporary directory
    execSync('rm -rf temp', { stdio: 'ignore' });
    
    // Initialize fresh git history
    execSync('git init', { stdio: 'ignore' });
    execSync('git add .', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit from AppPop template"', { stdio: 'ignore' });
    
    spinner.succeed('Template setup complete');
  } catch (error) {
    spinner.fail('Failed to clone template');
    console.error(chalk.red('Error details:'), error.message);
    
    // Attempt to clean up if something went wrong
    try {
      execSync('rm -rf temp', { stdio: 'ignore' });
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    
    process.exit(1);
  }
};

const updateProjectFiles = async (projectName, supabaseConfig) => {
  console.log(chalk.bold('\n5. Customizing project files'));
  const spinner = ora('Updating project references...').start();

  try {
    // Files to update
    const filesToUpdate = [
      'package.json',
      'README.md',
      'index.html',
      'vite.config.ts',
      '.env',
      '.env.example',
      'capacitor.config.ts',
      'supabase/config.toml'
    ];

    for (const file of filesToUpdate) {
      try {
        const content = await readFile(file, 'utf8');
        let updatedContent = content;

        if (file === 'capacitor.config.ts') {
          // Special handling for Capacitor config
          updatedContent = content
            .replace(/appId: ['"]com\.apppop\.app['"]/g, `appId: 'com.${projectName.toLowerCase()}.app'`)
            .replace(/appName: ['"]AppPop['"]/g, `appName: '${projectName.charAt(0).toUpperCase() + projectName.slice(1).toLowerCase()}'`);
        } else if (file === 'supabase/config.toml') {
          // Special handling for Supabase config
          updatedContent = content
            .replace(/project_id = ".*"/g, `project_id = "${supabaseConfig.supabaseProjectId}"`)
            .replace(/name = "apppop"/g, `name = "${projectName.toLowerCase()}"`);
        } else {
          // Standard replacement for other files
          updatedContent = content
            .replace(/apppop/g, projectName.toLowerCase())
            .replace(/AppPop/g, projectName.charAt(0).toUpperCase() + projectName.slice(1).toLowerCase());
        }

        await writeFile(file, updatedContent);
      } catch (err) {
        // Skip if file doesn't exist
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
    }

    // Update package name and version
    const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
    packageJson.name = projectName.toLowerCase();
    packageJson.version = '0.0.1';
    await writeFile('package.json', JSON.stringify(packageJson, null, 2));

    spinner.succeed('Project files updated');
  } catch (error) {
    spinner.fail('Failed to update project files');
    console.error(chalk.red('Error details:'), error.message);
    process.exit(1);
  }
};

const setupEnvironment = async (projectName, supabaseConfig) => {
  console.log(chalk.bold('\n6. Setting up environment variables'));
  
  // Security warning box for environment variables
  console.log(chalk.dim(`
    +------------------------------------------------------+
    |   ${chalk.red('⚠️  SECURITY WARNINGS - PLEASE READ CAREFULLY')}         |
    +------------------------------------------------------+
    | ${chalk.yellow('1. Environment Files:')}                                |
    |    • NEVER commit .env files to version control      |
    |    • Keep .env.example with dummy values for reference|
    |    • Each developer should maintain their own .env   |
    |                                                      |
    | ${chalk.yellow('2. API Keys & Secrets:')}                              |
    |    • Keep service_role key ONLY in backend .env      |
    |    • Use anon key for frontend applications         |
    |    • Rotate keys if accidentally exposed            |
    |                                                      |
    | ${chalk.yellow('3. Best Practices:')}                                  |
    |    • Set up proper Row Level Security (RLS)         |
    |    • Use different keys for dev/staging/prod        |
    |    • Regularly audit API key usage                  |
    |                                                      |
    | ${chalk.yellow('4. Version Control:')}                                 |
    |    • .env is already in .gitignore                  |
    |    • Double-check before pushing changes            |
    |    • Use secrets management in CI/CD                |
    +------------------------------------------------------+
  `));

  const spinner = ora('Creating environment files...').start();
  
  const envContent = `# Environment Variables for ${projectName}
# ⚠️  WARNING: NEVER commit this file to version control
# ⚠️  WARNING: Keep this file secure and private

# App Configuration
VITE_APP_NAME=${projectName}

# Supabase Configuration
VITE_APP_SUPABASE_URL=${supabaseConfig.supabaseUrl}
VITE_APP_SUPABASE_ANON_KEY=${supabaseConfig.supabaseAnonKey}

# Optional Third-Party Services (configure as needed)
# ------------------------------------------------
# Stripe Configuration
VITE_APP_STRIPE_PUBLIC_KEY=
# STRIPE_SECRET_KEY=         # ⚠️ Only use in backend, never in frontend!

# Analytics & Monitoring
VITE_CLARITY_TRACKING_CODE=  # Microsoft Clarity
VITE_GTM_CONTAINER_ID=       # Google Tag Manager
VITE_GA4_MEASUREMENT_ID=     # Google Analytics 4

# Error Tracking
VITE_SENTRY_DSN=            # Sentry Error Tracking

# ⚠️  IMPORTANT NOTES:
# 1. All VITE_ prefixed variables will be exposed to the frontend
# 2. Keep sensitive keys (like STRIPE_SECRET_KEY) in a separate .env.backend file
# 3. Use appropriate key prefixes based on your environment:
#    - VITE_APP_ for application-specific variables
#    - VITE_ for framework variables
#    - No prefix for backend-only variables`;

  const envExampleContent = `# Example Environment Variables for ${projectName}
# Copy this file to .env and fill in your values

# App Configuration
VITE_APP_NAME=${projectName}

# Supabase Configuration
VITE_APP_SUPABASE_URL=https://your-project.supabase.co
VITE_APP_SUPABASE_ANON_KEY=your-anon-key

# Optional Third-Party Services
VITE_APP_STRIPE_PUBLIC_KEY=pk_test_...
VITE_CLARITY_TRACKING_CODE=xxxxxxxx
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_GTM_CONTAINER_ID=GTM-XXXXXX
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX`;

  try {
    // Create .env file
    await writeFile('.env', envContent);
    
    // Create .env.example file
    await writeFile('.env.example', envExampleContent);
    
    // Ensure .env is in .gitignore
    const gitignorePath = '.gitignore';
    try {
      const gitignoreContent = await readFile(gitignorePath, 'utf8');
      if (!gitignoreContent.includes('.env')) {
        await writeFile(gitignorePath, gitignoreContent + '\n# Environment Variables\n.env\n.env.local\n.env.*.local\n');
      }
    } catch (err) {
      // If .gitignore doesn't exist, create it
      await writeFile(gitignorePath, '# Environment Variables\n.env\n.env.local\n.env.*.local\n');
    }

    spinner.succeed('Environment files created and .gitignore updated');
    
    // Additional security reminders
    console.log(chalk.cyan('\nEnvironment Setup Complete! Important Reminders:'));
    console.log('1. Your .env file contains sensitive information - keep it secure');
    console.log('2. Share the .env.example file with your team, NOT the .env file');
    console.log('3. Different environments (dev/staging/prod) should use different keys');
    console.log('4. Consider using a secrets manager for production deployments');
    console.log(chalk.yellow('\nRecommended Security Practices:'));
    console.log('• Regularly rotate your API keys');
    console.log('• Set up Row Level Security (RLS) in Supabase');
    console.log('• Use environment-specific API keys');
    console.log('• Monitor API key usage for unusual patterns');
    
  } catch (error) {
    spinner.fail('Failed to create environment files');
    console.error(error);
    process.exit(1);
  }
};

const installDependencies = () => {
  console.log(chalk.bold('\n7. Installing dependencies'));
  const spinner = ora('Installing npm packages...').start();
  try {
    execSync('npm install', { stdio: 'ignore' });
    spinner.succeed('Dependencies installed');
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    console.error(error);
    process.exit(1);
  }
};

const setupSupabaseCLI = () => {
  console.log(chalk.bold('\n8. Setting up Supabase CLI'));
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

const showFinalInstructions = (projectDir) => {
  console.log(chalk.green('\n✅ Project setup complete!'));
  console.log('\nNext steps:');
  console.log(`1. cd ${projectDir}`);
  console.log('2. Review and update package.json with your project details');
  console.log('3. Configure Authentication:');
  console.log('   • Check Auth.md in your project root for detailed setup instructions');
  console.log('   • Set up email verification');
  console.log('   • Configure SMTP for auth emails');
  console.log('   • Implement security best practices');
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
  console.log('   • Configure in src/config/theme.config.ts:');
  console.log('     ```');
  console.log('     defaultColorScheme: "your-choice"');
  console.log('     defaultFontScheme: "your-choice"');
  console.log('     defaultDarkMode: true/false');
  console.log('     ```');
  console.log('5. Run \'npm run dev\' to start the development server');
  console.log('6. Set up additional services as needed:');
  console.log('   - Stripe for payments');
  console.log('   - Microsoft Clarity for analytics');
  console.log('   - Sentry for error monitoring');
  console.log('   - Google Tag Manager for analytics');
  console.log('7. Update the README.md with your project specifics');
  
  console.log(chalk.cyan('\nImportant Security Reminder:'));
  console.log('• Review Auth.md for security best practices');
  console.log('• Set up Row Level Security (RLS) policies');
  console.log('• Configure proper email verification');
  console.log('• Never commit sensitive keys or .env files');

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
  console.log('• See theme-system.md for custom theme creation');
  
  console.log(chalk.bold('\nHappy coding! 🎉'));
};

const main = async () => {
  console.log(chalk.bold('🚀 Welcome to the AppPop Template Bootstrap\n'));
  
  try {
    checkPrerequisites();
    const { projectName, projectDir } = await createProjectStructure();
    initializeGit();
    const supabaseConfig = await configureSupabase();
    await cloneTemplate();
    await updateProjectFiles(projectName, supabaseConfig);
    await setupEnvironment(projectName, supabaseConfig);
    installDependencies();
    setupSupabaseCLI();
    showFinalInstructions(projectDir);
  } catch (error) {
    console.error(chalk.red('An error occurred during setup:'), error);
    process.exit(1);
  } finally {
    rl.close();
  }
};

main(); 
