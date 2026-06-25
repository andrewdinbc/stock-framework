const fs = require('fs');
const https = require('https');

const DEPLOYMENTS = {
  production: process.env.PROD_URL || 'https://stock-framework.vercel.app',
  staging: process.env.STAGING_URL || 'https://stock-framework-staging.vercel.app',
};

const PAGES_TO_CHECK = [
  '/',
  '/dashboard',
  '/portfolio',
  '/api/health',
];

const ENV_VARS_REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 5000 }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        statusText: `${res.statusCode} ${res.statusMessage}`,
        headers: res.headers,
        success: res.statusCode >= 200 && res.statusCode < 400,
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: null,
        error: err.message,
        success: false,
      });
    });
  });
}

async function verifyDeployment(deploymentName, baseUrl) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`VERIFYING: ${deploymentName.toUpperCase()}`);
  console.log(`Base URL: ${baseUrl}`);
  console.log(`${'='.repeat(60)}\n`);

  const results = {
    deployment: deploymentName,
    baseUrl,
    timestamp: new Date().toISOString(),
    pages: [],
    envVars: {},
    overallStatus: 'UNKNOWN',
  };

  // Check pages
  console.log('📄 PAGE LOAD VERIFICATION');
  for (const page of PAGES_TO_CHECK) {
    const fullUrl = `${baseUrl}${page}`;
    const result = await checkUrl(fullUrl);
    results.pages.push(result);
    console.log(
      `  ${result.success ? '✅' : '❌'} ${page.padEnd(20)} → ${result.statusText || result.error}`
    );
  }

  // Check environment variables (if running in deployment context)
  console.log('\n🔐 ENVIRONMENT VARIABLES');
  for (const varName of ENV_VARS_REQUIRED) {
    const exists = !!process.env[varName];
    results.envVars[varName] = exists ? 'PRESENT' : 'MISSING';
    console.log(
      `  ${exists ? '✅' : '❌'} ${varName.padEnd(35)} → ${exists ? 'PRESENT' : 'MISSING'}`
    );
  }

  // Overall status
  const allPagesLoaded = results.pages.every((p) => p.success);
  const allEnvVarsPresent = Object.values(results.envVars).every((v) => v === 'PRESENT');
  results.overallStatus = allPagesLoaded && allEnvVarsPresent ? 'HEALTHY' : 'DEGRADED';

  console.log(`\n📊 OVERALL STATUS: ${results.overallStatus}`);
  console.log(`  Pages Healthy: ${results.pages.filter((p) => p.success).length}/${results.pages.length}`);
  console.log(`  Env Vars Present: ${Object.values(results.envVars).filter((v) => v === 'PRESENT').length}/${ENV_VARS_REQUIRED.length}`);

  return results;
}

async function main() {
  const allResults = [];

  for (const [deploymentName, baseUrl] of Object.entries(DEPLOYMENTS)) {
    const result = await verifyDeployment(deploymentName, baseUrl);
    allResults.push(result);
  }

  // Write report
  const reportPath = 'deployment-verification-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
  console.log(`\n✅ Report saved to: ${reportPath}\n`);
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});