import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';

const USERNAME = 'john';
const PASSWORD = 'demo';
const FULL_NAME = 'John Smith';

test.describe('ParaBank – Critical Banking Workflow', () => {
  test('user can log in and view accounts overview', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);
  });

  test('user can transfer funds between accounts', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);
    const transferPage = new TransferFundsPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);

    await overviewPage.goToTransferFunds();
    await transferPage.expectLoaded();
    await transferPage.waitForAccounts();

    const fromOptions = await transferPage.getFromAccountOptions();
    const toOptions = await transferPage.getToAccountOptions();

    expect(fromOptions.length).toBeGreaterThanOrEqual(2);
    expect(toOptions.length).toBeGreaterThanOrEqual(2);

    const fromAccount = fromOptions[0];
    const toAccount = toOptions[1];

    await transferPage.transfer('50', fromAccount, toAccount);
    await transferPage.expectTransferSuccess('50.00', fromAccount, toAccount);
  });

  test('displays error on invalid login credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invaliduser', 'wrongpassword');
    await loginPage.expectLoginError();
  });

  test('user can log out successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);

    await overviewPage.logout();

    await expect(page).toHaveURL(/\/parabank\/index\.htm/);
    await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
  });
});
