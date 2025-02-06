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

interface ProjectConfig {
  projectName: string;
  projectDir: string;
}

const createProjectStructure = async (): Promise<ProjectConfig> => {
  console.log(chalk.bold('\n1. Project Configuration'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter project name:',
      default: 'my-apppop-app'
    },
    {
      type: 'input',
      name: 'projectDir',
      message: 'Enter directory to create project in:',
      default: (answers: any) => `./${answers.projectName}`
    }
  ]);

  return answers;
};

const cloneTemplate = (projectDir: string): void => {
  const spinner = ora('Cloning template repository...').start();
  try {
    // Clone directly into the target directory
    execSync(`git clone --depth 1 ${TEMPLATE_REPO} ${projectDir}`, { 
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf-8'
    });
    
    // Change to project directory after cloning
    process.chdir(projectDir);
    
    // Replace README.md with our tenant version
    const tenantReadmePath = join(__dirname, '..', 'tenant_readme.md');
    const setupPath = join(__dirname, '..', 'setup.md');
    
    execSync(`cp ${tenantReadmePath} README.md`, { stdio: 'ignore' });
    execSync(`cp ${setupPath} docs/setup.md`, { stdio: 'ignore' });
    
    execSync('rm -rf .git', { stdio: 'ignore' }); // Remove git history
    execSync('rm -rf .claudesync', { stdio: 'ignore' }); // Remove Claude sync folder
    spinner.succeed('Template repository cloned and cleaned');
  } catch (error) {
    spinner.fail('Failed to clone template');
    if (error instanceof Error) {
      console.error(chalk.red('\nError details:'));
      // @ts-ignore - execSync error has stderr property
      if (error.stderr) console.error(chalk.yellow(error.stderr));
      // @ts-ignore - execSync error has stdout property
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
    spinner.succeed('Git repository initialized');
  } catch (error) {
    spinner.fail('Failed to initialize git');
    console.error(error);
    process.exit(1);
  }
};

const updateProjectFiles = async (projectName: string): Promise<void> => {
  const spinner = ora('Updating project files...').start();
  try {
    const packageJson = JSON.parse(await readFile('package.json', 'utf-8'));
    packageJson.name = projectName;
    packageJson.version = '0.1.0';
    await writeFile('package.json', JSON.stringify(packageJson, null, 2));
    spinner.succeed('Project files updated');
  } catch (error) {
    spinner.fail('Failed to update project files');
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

const main = async (): Promise<void> => {
  console.log(chalk.bold.green('\nWelcome to AppPop Project Creator! 🚀\n'));
  
  try {
    checkPrerequisites();
    const { projectName, projectDir } = await createProjectStructure();
    cloneTemplate(projectDir);
    initializeGit();
    await updateProjectFiles(projectName);
    installDependencies();

    console.log(chalk.bold.green('\n✨ Project created successfully! ✨\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.dim(`  1. cd ${projectDir}`));
    console.log(chalk.dim('  2. npm run dev'));
    console.log(chalk.dim('\nHappy coding! 🎉\n'));
  } catch (error) {
    console.error(chalk.red('\nAn error occurred:'), error);
    process.exit(1);
  }
};

// Ensure we handle the promise rejection
main().catch((error) => {
  console.error(chalk.red('\nUnexpected error:'), error);
  process.exit(1);
}); 
