import { chromium } from '@playwright/test';

const BASE_URL = 'https://parabank.parasoft.com/parabank';

/**
 * Global setup: initialise the ParaBank database before the test suite runs.
 * This ensures the default demo user (john/demo) always exists, regardless of
 * whatever state the shared public server is in.
 */
export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${BASE_URL}/admin.htm`);

  // Ensure Data Access Mode is set to JDBC so login works correctly
  const jdbcRadio = page.locator('input[value="jdbc"]');
  if (!(await jdbcRadio.isChecked())) {
    await jdbcRadio.check();
  }

  // Set Loan Provider to "Local" so loan requests use the in-process processor
  // rather than the external SOAP endpoint (which may be misconfigured or unavailable)
  await page.locator('select[name="loanProvider"]').selectOption('local');

  // Submit the admin settings form
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForURL(/\/admin\.htm/, { timeout: 10000 });

  // Initialize the database to restore the default demo user (john/demo)
  await page.locator('button[value="INIT"]').click();
  await page.waitForURL(/\/db\.htm/, { timeout: 15000 });
  await page.getByText('Database Initialized').waitFor({ timeout: 15000 });

  await browser.close();
}
