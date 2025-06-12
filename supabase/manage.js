#!/usr/bin/env node
const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

async function main() {
  console.log('\n🔧 Supabase Management CLI 🔧\n');
  console.log('1. Test Supabase Connection');
  console.log('2. Run Database Migrations');
  console.log('3. Update Supabase Credentials');
  console.log('4. Exit');

  rl.question('\nSelect an option (1-4): ', async (answer) => {
    try {
      switch (answer) {
        case '1':
          console.log('\nTesting Supabase connection...');
          await runCommand('yarn test:supabase');
          break;
        case '2':
          console.log('\nRunning database migrations...');
          await runCommand('yarn supabase:migrate --run');
          break;
        case '3':
          updateCredentials();
          return; // Don't close RL yet
        case '4':
          console.log('Exiting...');
          rl.close();
          return;
        default:
          console.log('Invalid option. Please select 1-4.');
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
    
    rl.question('\nPress Enter to continue...', () => {
      main(); // Return to menu
    });
  });
}

function updateCredentials() {
  console.log('\n📝 Update Supabase Credentials');
  console.log('You can find these in your Supabase project settings > API');
  
  rl.question('Supabase Project URL: ', (url) => {
    rl.question('Supabase Anon Key: ', (anonKey) => {
      rl.question('Supabase Service Role Key (optional): ', (serviceKey) => {
        try {
          const envPath = path.join(__dirname, '.env.local');
          let envContent = '';
          
          if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
            
            // Replace existing values
            envContent = envContent.replace(
              /NEXT_PUBLIC_SUPABASE_URL=.*/,
              `NEXT_PUBLIC_SUPABASE_URL=${url}`
            );
            envContent = envContent.replace(
              /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/,
              `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`
            );
            
            if (serviceKey) {
              if (envContent.includes('SUPABASE_SERVICE_KEY=')) {
                envContent = envContent.replace(
                  /SUPABASE_SERVICE_KEY=.*/,
                  `SUPABASE_SERVICE_KEY=${serviceKey}`
                );
              } else {
                envContent += `\nSUPABASE_SERVICE_KEY=${serviceKey}`;
              }
            }
          } else {
            // Create new file
            envContent = `NEXT_PUBLIC_SUPABASE_URL=${url}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`;
            if (serviceKey) {
              envContent += `\nSUPABASE_SERVICE_KEY=${serviceKey}`;
            }
          }
          
          fs.writeFileSync(envPath, envContent);
          console.log('\n✅ Credentials updated successfully in .env.local');
        } catch (err) {
          console.error('Error updating credentials:', err);
        }
        
        rl.question('\nPress Enter to continue...', () => {
          main(); // Return to menu
        });
      });
    });
  });
}

// Start the CLI
main();
