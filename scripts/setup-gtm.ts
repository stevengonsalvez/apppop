import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Setup environment
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SCOPES = ['https://www.googleapis.com/auth/tagmanager.edit.containers'];

interface GTMConfig {
  accountId: string;
  containerId: string;
  workspaceId: string;
}

async function createWithRetry(operation: () => Promise<any>, name: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      console.error(`Failed to create ${name} (attempt ${i + 1}/${retries}):`, {
        message: error.message,
        details: error.response?.data || error
      });
      
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

class GTMSetup {
  private tagmanager;
  private config: GTMConfig;

  constructor(credentials: any, config: GTMConfig) {
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: SCOPES,
    });

    this.tagmanager = google.tagmanager({
      version: 'v2',
      auth: client
    });

    this.config = config;
  }

  private get path() {
    const { accountId, containerId, workspaceId } = this.config;
    return `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`;
  }

  private get containerPath() {
    const { accountId, containerId } = this.config;
    // Use numeric container ID for all operations
    return `accounts/${accountId}/containers/${containerId}`;
  }

  async listVariables() {
    console.log('Listing variables with path:', this.path);
    return this.tagmanager.accounts.containers.workspaces.variables.list({
      parent: this.path
    });
  }

  async listWorkspaces() {
    console.log('Listing workspaces for container:', this.containerPath);
    return this.tagmanager.accounts.containers.workspaces.list({
      parent: this.containerPath
    });
  }

  async createVariable(variable: any) {
    console.log(`Creating variable ${variable.name} with path:`, this.path);
    return this.tagmanager.accounts.containers.workspaces.variables.create({
      parent: this.path,
      requestBody: variable
    });
  }

  async createTrigger(trigger: any) {
    return this.tagmanager.accounts.containers.workspaces.triggers.create({
      parent: this.path,
      requestBody: trigger
    });
  }

  async createTag(tag: any) {
    return this.tagmanager.accounts.containers.workspaces.tags.create({
      parent: this.path,
      requestBody: tag
    });
  }

  async verifyAccess() {
    console.log('Verifying GTM access...');
    
    // Test workspace access
    console.log('Testing workspace access...');
    try {
      const workspaces = await this.listWorkspaces();
      console.log('Available workspaces:', workspaces.data);
    } catch (error: any) {
      console.error('Error accessing workspaces:', {
        message: error.message,
        details: error.response?.data || error
      });
      throw error;
    }

    // Test variable access
    console.log('Testing variable access...');
    try {
      const variables = await this.listVariables();
      console.log('Existing variables:', variables.data);
    } catch (error: any) {
      console.error('Error accessing variables:', {
        message: error.message,
        details: error.response?.data || error
      });
      throw error;
    }
  }

  async setup() {
    try {
      console.log('Starting GTM setup...');
      console.log('Using configuration:', {
        path: this.path,
        containerPath: this.containerPath
      });

      // Verify access before proceeding
      await this.verifyAccess();

      // Create Custom Variables
      console.log('Creating custom variables...');
      const customVars = [
        {
          name: 'User ID',
          type: 'v',
          variableType: 'v',  // Changed from 'jsm' to 'v' for Data Layer Variable
          parameter: [
            {
              type: 'template',
              key: 'dataLayerVersion',
              value: '2'
            },
            {
              type: 'template',
              key: 'name',
              value: 'user_properties.userId'
            },
            {
              type: 'template',
              key: 'dataLayer',
              value: '{{DataLayer}}'
            }
          ]
        },
        {
          name: 'Page Title',
          type: 'v',
          variableType: 'v',
          parameter: [
            {
              type: 'template',
              key: 'dataLayerVersion',
              value: '2'
            },
            {
              type: 'template',
              key: 'name',
              value: 'page_title'
            },
            {
              type: 'template',
              key: 'dataLayer',
              value: '{{DataLayer}}'
            }
          ]
        },
        {
          name: 'Event Method',
          type: 'v',
          variableType: 'v',
          parameter: [
            {
              type: 'template',
              key: 'dataLayerVersion',
              value: '2'
            },
            {
              type: 'template',
              key: 'name',
              value: 'event.method'
            },
            {
              type: 'template',
              key: 'dataLayer',
              value: '{{DataLayer}}'
            }
          ]
        },
        {
          name: 'Event Success',
          type: 'v',
          variableType: 'v',
          parameter: [
            {
              type: 'template',
              key: 'dataLayerVersion',
              value: '2'
            },
            {
              type: 'template',
              key: 'name',
              value: 'event.success'
            },
            {
              type: 'template',
              key: 'dataLayer',
              value: '{{DataLayer}}'
            }
          ]
        },
        {
          name: 'Updated Fields',
          type: 'v',
          variableType: 'v',
          parameter: [
            {
              type: 'template',
              key: 'dataLayerVersion',
              value: '2'
            },
            {
              type: 'template',
              key: 'name',
              value: 'event.updated_fields'
            },
            {
              type: 'template',
              key: 'dataLayer',
              value: '{{DataLayer}}'
            }
          ]
        },
        {
          name: 'Ecommerce Items',
          type: 'v',
          variableType: 'v',
          parameter: [
            {
              type: 'template',
              key: 'dataLayerVersion',
              value: '2'
            },
            {
              type: 'template',
              key: 'name',
              value: 'ecommerce.items'
            },
            {
              type: 'template',
              key: 'dataLayer',
              value: '{{DataLayer}}'
            }
          ]
        },
        {
          name: 'Total Value',
          type: 'v',
          variableType: 'v',
          parameter: [
            {
              type: 'template',
              key: 'dataLayerVersion',
              value: '2'
            },
            {
              type: 'template',
              key: 'name',
              value: 'ecommerce.value'
            },
            {
              type: 'template',
              key: 'dataLayer',
              value: '{{DataLayer}}'
            }
          ]
        }
      ];

      for (const variable of customVars) {
        try {
          console.log(`Creating variable: ${variable.name}...`);
          await createWithRetry(
            () => this.createVariable(variable),
            `custom variable ${variable.name}`
          );
          console.log(`✅ Created variable: ${variable.name}`);
        } catch (error: any) {
          if (error.response?.status === 409) {
            console.log(`Variable ${variable.name} already exists, skipping...`);
            continue;
          }
          throw error;
        }
      }

      // Create Triggers
      console.log('Creating triggers...');
      const triggers = [
        {
          name: 'All Pages',
          type: 'pageview'
        },
        {
          name: 'Login Event',
          type: 'customEvent',
          customEventFilter: [{
            type: 'equals',
            parameter: [
              {
                type: 'template',
                key: 'arg0',
                value: '{{Event}}'
              },
              {
                type: 'template',
                key: 'arg1',
                value: 'login'
              }
            ]
          }]
        },
        {
          name: 'Profile Update',
          type: 'customEvent',
          customEventFilter: [{
            type: 'equals',
            parameter: [
              {
                type: 'template',
                key: 'arg0',
                value: '{{Event}}'
              },
              {
                type: 'template',
                key: 'arg1',
                value: 'profile_update'
              }
            ]
          }]
        },
        {
          name: 'View Item',
          type: 'customEvent',
          customEventFilter: [{
            type: 'equals',
            parameter: [
              {
                type: 'template',
                key: 'arg0',
                value: '{{Event}}'
              },
              {
                type: 'template',
                key: 'arg1',
                value: 'view_item'
              }
            ]
          }]
        },
        {
          name: 'Begin Checkout',
          type: 'customEvent',
          customEventFilter: [{
            type: 'equals',
            parameter: [
              {
                type: 'template',
                key: 'arg0',
                value: '{{Event}}'
              },
              {
                type: 'template',
                key: 'arg1',
                value: 'begin_checkout'
              }
            ]
          }]
        }
      ];

      const createdTriggers: Record<string, string> = {};
      for (const trigger of triggers) {
        try {
          const result = await createWithRetry(
            () => this.createTrigger(trigger),
            `trigger ${trigger.name}`
          );
          createdTriggers[trigger.name] = result.data.triggerId;
        } catch (error: any) {
          if (error.response?.status === 409) {
            console.log(`Trigger ${trigger.name} already exists, skipping...`);
            // Try to fetch existing trigger ID
            const existingTriggers = await this.tagmanager.accounts.containers.workspaces.triggers.list({
              parent: this.path
            });
            const existingTrigger = existingTriggers.data.trigger?.find(t => t.name === trigger.name);
            if (existingTrigger?.triggerId) {
              createdTriggers[trigger.name] = existingTrigger.triggerId;
              continue;
            }
          }
          throw error;
        }
      }

      // Create GA4 Configuration Tag
      console.log('Creating GA4 configuration tag...');
      try {
        await createWithRetry(
          () => this.createTag({
            name: 'GA4 - Configuration',
            type: 'gaawc',
            parameter: [
              {
                type: 'template',
                key: 'measurementId',
                value: process.env.VITE_GA4_MEASUREMENT_ID
              },
              {
                type: 'boolean',
                key: 'sendPageView',
                value: true
              },
              {
                type: 'boolean',
                key: 'enableSendToServerContainer',
                value: false
              }
            ],
            firingTriggerId: [createdTriggers['All Pages']]
          }),
          'GA4 configuration tag'
        );
      } catch (error: any) {
        if (error.response?.status === 409) {
          console.log('GA4 configuration tag already exists, skipping...');
        } else {
          throw error;
        }
      }

      // Create GA4 Event Tags
      console.log('Creating GA4 event tags...');
      const eventTags = [
        {
          name: 'GA4 - Login',
          type: 'gaawe',  // GA4 event
          parameter: [
            {
              type: 'template',
              key: 'eventName',
              value: 'login'
            },
            {
              type: 'list',
              key: 'eventParameters',
              list: [
                {
                  type: 'map',
                  map: [
                    {
                      type: 'template',
                      key: 'name',
                      value: 'method'
                    },
                    {
                      type: 'template',
                      key: 'value',
                      value: '{{Event Method}}'
                    }
                  ]
                },
                {
                  type: 'map',
                  map: [
                    {
                      type: 'template',
                      key: 'name',
                      value: 'success'
                    },
                    {
                      type: 'template',
                      key: 'value',
                      value: '{{Event Success}}'
                    }
                  ]
                }
              ]
            }
          ],
          firingTriggerId: [createdTriggers['Login Event']]
        },
        {
          name: 'GA4 - Profile Update',
          type: 'gaawe',
          parameter: [
            {
              type: 'template',
              key: 'eventName',
              value: 'profile_update'
            },
            {
              type: 'list',
              key: 'eventParameters',
              list: [
                {
                  type: 'map',
                  map: [
                    {
                      type: 'template',
                      key: 'name',
                      value: 'updated_fields'
                    },
                    {
                      type: 'template',
                      key: 'value',
                      value: '{{Updated Fields}}'
                    }
                  ]
                }
              ]
            }
          ],
          firingTriggerId: [createdTriggers['Profile Update']]
        },
        {
          name: 'GA4 - View Item',
          type: 'gaawe',
          parameter: [
            {
              type: 'template',
              key: 'eventName',
              value: 'view_item'
            },
            {
              type: 'template',
              key: 'measurementId',
              value: process.env.VITE_GA4_MEASUREMENT_ID
            },
            {
              type: 'template',
              key: 'userProperties',
              value: '{"user_id": "{{User ID}}"}'
            },
            {
              type: 'list',
              key: 'eventParameters',
              list: [
                {
                  type: 'map',
                  map: [
                    {
                      type: 'template',
                      key: 'name',
                      value: 'items'
                    },
                    {
                      type: 'template',
                      key: 'value',
                      value: '{{Ecommerce Items}}'
                    }
                  ]
                }
              ]
            }
          ],
          firingTriggerId: [createdTriggers['View Item']]
        },
        {
          name: 'GA4 - Begin Checkout',
          type: 'gaawe',
          parameter: [
            {
              type: 'template',
              key: 'eventName',
              value: 'begin_checkout'
            },
            {
              type: 'template',
              key: 'measurementId',
              value: process.env.VITE_GA4_MEASUREMENT_ID
            },
            {
              type: 'list',
              key: 'eventParameters',
              list: [
                {
                  type: 'map',
                  map: [
                    {
                      type: 'template',
                      key: 'name',
                      value: 'items'
                    },
                    {
                      type: 'template',
                      key: 'value',
                      value: '{{Ecommerce Items}}'
                    }
                  ]
                },
                {
                  type: 'map',
                  map: [
                    {
                      type: 'template',
                      key: 'name',
                      value: 'value'
                    },
                    {
                      type: 'template',
                      key: 'value',
                      value: '{{Total Value}}'
                    }
                  ]
                }
              ]
            }
          ],
          firingTriggerId: [createdTriggers['Begin Checkout']]
        }
      ];

      for (const tag of eventTags) {
        try {
          console.log(`Creating tag: ${tag.name}...`);
          await createWithRetry(
            () => this.createTag(tag),
            `GA4 event tag ${tag.name}`
          );
          console.log(`✅ Created tag: ${tag.name}`);
        } catch (error: any) {
          if (error.response?.status === 409) {
            console.log(`Tag ${tag.name} already exists, skipping...`);
            continue;
          }
          throw error;
        }
      }

      console.log('✅ GTM setup completed successfully!');
    } catch (error: any) {
      console.error('❌ Error setting up GTM:', {
        message: error.message,
        details: error.response?.data || error,
        stack: error.stack
      });
      throw error;
    }
  }
}

// Validate environment variables
function validateEnvironment() {
  const required = [
    'VITE_GTM_ACCOUNT_ID',
    'VITE_GTM_CONTAINER_ID',
    'VITE_GTM_WORKSPACE_ID',
    'VITE_GA4_MEASUREMENT_ID'
  ];

  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }

  // Validate GTM Container ID format
  if (!process.env.VITE_GTM_CONTAINER_ID?.startsWith('GTM-')) {
    console.error('❌ VITE_GTM_CONTAINER_ID must start with "GTM-"');
    process.exit(1);
  }

  // Validate GA4 Measurement ID format
  if (!process.env.VITE_GA4_MEASUREMENT_ID?.startsWith('G-')) {
    console.error('❌ VITE_GA4_MEASUREMENT_ID must start with "G-"');
    process.exit(1);
  }

  // Validate numeric container ID
  if (!process.env.VITE_GTM_NUMERIC_CONTAINER_ID?.match(/^\d+$/)) {
    console.error('❌ VITE_GTM_NUMERIC_CONTAINER_ID must be a numeric value');
    console.error('Please add VITE_GTM_NUMERIC_CONTAINER_ID to your .env file with the numeric container ID from GTM');
    process.exit(1);
  }
}

// Main setup function
async function main() {
  try {
    console.log('Validating environment...');
    validateEnvironment();

    console.log('Loading credentials...');
    const credentialsPath = join(__dirname, '..', 'config', 'gtm-credentials.json');
    let credentials;
    try {
      credentials = JSON.parse(await readFile(credentialsPath, 'utf-8'));
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.error('❌ Credentials file not found at:', credentialsPath);
        console.error('Please ensure you have placed your GTM credentials in config/gtm-credentials.json');
      } else {
        console.error('❌ Error reading credentials:', error.message);
      }
      process.exit(1);
    }

    const config: GTMConfig = {
      accountId: process.env.VITE_GTM_ACCOUNT_ID!,
      containerId: process.env.VITE_GTM_NUMERIC_CONTAINER_ID!,
      workspaceId: process.env.VITE_GTM_WORKSPACE_ID!
    };

    console.log('Starting GTM setup with config:', {
      accountId: config.accountId,
      containerId: config.containerId,
      workspaceId: config.workspaceId,
      ga4MeasurementId: process.env.VITE_GA4_MEASUREMENT_ID,
      path: `accounts/${config.accountId}/containers/${config.containerId}/workspaces/${config.workspaceId}`
    });

    const gtmSetup = new GTMSetup(credentials, config);
    await gtmSetup.setup();
  } catch (error: any) {
    console.error('❌ Failed to run GTM setup:', {
      message: error.message,
      details: error.response?.data || error,
      stack: error.stack
    });
    process.exit(1);
  }
}

// Run setup with proper error handling
(async () => {
  try {
    await main();
  } catch (error: any) {
    console.error('❌ Unhandled error:', {
      message: error.message,
      details: error.response?.data || error,
      stack: error.stack
    });
    process.exit(1);
  }
})(); 