import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup environment
dotenv.config();

async function testGTMAccess() {
  try {
    // Read credentials file
    const credentialsPath = join(__dirname, '..', 'config', 'gtm-credentials.json');
    const credentials = JSON.parse(await readFile(credentialsPath, 'utf-8'));
    
    // Create JWT client with full permissions
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/tagmanager.edit.containers']
    });

    // Initialize Tag Manager
    const tagmanager = google.tagmanager({
      version: 'v2',
      auth: client
    });

    // Test API access by listing accounts
    console.log('1. Testing GTM API access...');
    const accountsResponse = await tagmanager.accounts.list();
    
    if (!accountsResponse.data.account || accountsResponse.data.account.length === 0) {
      console.log('⚠️ No accounts found or no access to accounts');
      return;
    }

    console.log('✅ Successfully accessed GTM API');
    console.log('\nAvailable accounts:');
    accountsResponse.data.account.forEach(account => {
      console.log(`- Account Name: ${account.name}`);
      console.log(`  Account Path: ${account.path}`);
      console.log(`  Account ID: ${account.accountId}`);
    });

    // Test specific account access
    const targetAccountId = process.env.VITE_GTM_ACCOUNT_ID;
    console.log(`\n2. Testing access to specific account (${targetAccountId})...`);
    
    const targetAccount = accountsResponse.data.account.find(
      account => account.accountId === targetAccountId
    );

    if (!targetAccount) {
      console.log(`⚠️ Account ID ${targetAccountId} not found in accessible accounts`);
      return;
    }

    console.log('✅ Successfully found target account');

    // Test container access
    const containerId = process.env.VITE_GTM_CONTAINER_ID;
    console.log(`\n3. Testing access to container (${containerId})...`);

    try {
      const containerResponse = await tagmanager.accounts.containers.list({
        parent: `accounts/${targetAccountId}`
      });

      console.log('\nAccessible containers:');
      containerResponse.data.container?.forEach(container => {
        console.log(`- Container Name: ${container.name}`);
        console.log(`  Container ID: ${container.containerId}`);
        console.log(`  Container Path: ${container.path}`);
      });

      const targetContainer = containerResponse.data.container?.find(
        container => container.publicId === containerId
      );

      if (!targetContainer) {
        console.log(`⚠️ Container ${containerId} not found in accessible containers`);
        return;
      }

      console.log('✅ Successfully found target container');

      // Test workspace access
      const workspaceId = process.env.VITE_GTM_WORKSPACE_ID;
      const numericContainerId = targetContainer.containerId;  // Get the numeric ID from the container response
      console.log(`\n4. Testing access to workspace (${workspaceId})...`);

      const workspaceResponse = await tagmanager.accounts.containers.workspaces.list({
        parent: `accounts/${targetAccountId}/containers/${numericContainerId}`
      });

      console.log('\nAccessible workspaces:');
      workspaceResponse.data.workspace?.forEach(workspace => {
        console.log(`- Workspace Name: ${workspace.name}`);
        console.log(`  Workspace ID: ${workspace.workspaceId}`);
        console.log(`  Workspace Path: ${workspace.path}`);
      });

      const targetWorkspace = workspaceResponse.data.workspace?.find(
        workspace => workspace.workspaceId === workspaceId
      );

      if (!targetWorkspace) {
        console.log(`⚠️ Workspace ${workspaceId} not found in accessible workspaces`);
        return;
      }

      console.log('✅ Successfully found target workspace');
      console.log('\n🎉 All GTM components are accessible!');

    } catch (error: any) {
      console.error('❌ Error accessing container:', error.response?.data || error.message);
    }

  } catch (error: any) {
    console.error('❌ Error testing GTM API access:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data.error.message}`);
      console.error('Full error details:', error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

// Self-executing function for top-level await
(async () => {
  try {
    await testGTMAccess();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})(); 