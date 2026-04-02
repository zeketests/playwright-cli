import { test, expect } from '@playwright/test';

const BASE_URL = 'https://parabank.parasoft.com/parabank';
const USERNAME = 'john';
const PASSWORD = 'demo';

test.describe('ParaBank – Critical Banking Workflow', () => {
  test('user can log in and view accounts overview', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.htm`);

    await expect(page).toHaveTitle('ParaBank | Welcome | Online Banking');
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

    await page.locator('input[name="username"]').fill(USERNAME);
    await page.locator('input[name="password"]').fill(PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/overview.htm`);
    await expect(page).toHaveTitle('ParaBank | Accounts Overview');
    await expect(page.getByText('Welcome John Smith')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();

    // At least one account row should be present in the table
    const accountRows = page.locator('table tbody tr');
    await expect(accountRows).not.toHaveCount(0);
  });

  test('user can transfer funds between accounts', async ({ page }) => {
    // Log in
    await page.goto(`${BASE_URL}/index.htm`);
    await page.locator('input[name="username"]').fill(USERNAME);
    await page.locator('input[name="password"]').fill(PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/overview.htm`);

    // Navigate to Transfer Funds
    await page.getByRole('link', { name: 'Transfer Funds' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/transfer.htm`);
    await expect(page.getByRole('heading', { name: 'Transfer Funds' })).toBeVisible();

    // Get the available source and destination accounts from the dropdowns
    // The accounts are populated dynamically via AJAX — wait for them to appear
    const fromSelect = page.locator('#fromAccountId');
    const toSelect = page.locator('#toAccountId');

    await expect(fromSelect.locator('option').first()).toBeAttached();
    await expect(toSelect.locator('option').nth(1)).toBeAttached();

    const fromOptions = await fromSelect.locator('option').allTextContents();
    const toOptions = await toSelect.locator('option').allTextContents();

    expect(fromOptions.length).toBeGreaterThanOrEqual(2);
    expect(toOptions.length).toBeGreaterThanOrEqual(2);

    const fromAccount = fromOptions[0].trim();
    const toAccount = toOptions[1].trim(); // transfer to a different account

    // Fill in the transfer form
    await page.locator('#amount').fill('50');
    await fromSelect.selectOption(fromAccount);
    await toSelect.selectOption(toAccount);

    await page.getByRole('button', { name: 'Transfer' }).click();

    // Verify transfer success
    await expect(page.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible();
    await expect(
      page.getByText(`$50.00 has been transferred from account #${fromAccount} to account #${toAccount}.`)
    ).toBeVisible();
  });

  test('displays error on invalid login credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.htm`);

    await page.locator('input[name="username"]').fill('invaliduser');
    await page.locator('input[name="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page.getByText('The username and password could not be verified.')).toBeVisible();
  });

  test('user can log out successfully', async ({ page }) => {
    // Log in
    await page.goto(`${BASE_URL}/index.htm`);
    await page.locator('input[name="username"]').fill(USERNAME);
    await page.locator('input[name="password"]').fill(PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/overview.htm`);

    // Log out
    await page.getByRole('link', { name: 'Log Out' }).click();

    // Should return to the login/home page (URL may include query params like ?ConnType=JDBC)
    await expect(page).toHaveURL(/\/parabank\/index\.htm/);
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
  });
});
