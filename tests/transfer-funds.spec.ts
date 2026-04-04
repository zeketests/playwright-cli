import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';

const USERNAME = 'john';
const PASSWORD = 'demo';
const FULL_NAME = 'John Smith';

test.describe('Transfer Funds', () => {
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

  test('transfer page displays all required form elements', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);
    const transferPage = new TransferFundsPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);

    await overviewPage.goToTransferFunds();
    await transferPage.expectLoaded();

    await expect(transferPage.amountInput).toBeVisible();
    await expect(transferPage.fromAccountSelect).toBeVisible();
    await expect(transferPage.toAccountSelect).toBeVisible();
    await expect(transferPage.transferButton).toBeVisible();
  });

  test('submitting transfer with empty amount shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);
    const transferPage = new TransferFundsPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);

    await overviewPage.goToTransferFunds();
    await transferPage.expectLoaded();
    await transferPage.waitForAccounts();
    await transferPage.transferButton.click();
    await transferPage.expectErrorDisplayed();
  });

  test('submitting transfer with non-numeric amount shows error', async ({ page }) => {
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

    await transferPage.transfer('abc', fromOptions[0], toOptions[1]);
    await transferPage.expectErrorDisplayed();
  });

  test('transfer with decimal amount succeeds', async ({ page }) => {
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
    const fromAccount = fromOptions[0];
    const toAccount = toOptions[1];

    await transferPage.transfer('25.50', fromAccount, toAccount);
    await transferPage.expectTransferSuccess('25.50', fromAccount, toAccount);
  });

  test('success page shows account activity message', async ({ page }) => {
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

    await transferPage.transfer('10', fromOptions[0], toOptions[1]);
    await transferPage.expectTransferSuccess('10.00', fromOptions[0], toOptions[1]);
    await transferPage.expectActivityMessageVisible();
  });

  test('unauthenticated user cannot access transfer page directly', async ({ page }) => {
    const transferPage = new TransferFundsPage(page);

    await page.goto('https://parabank.parasoft.com/parabank/transfer.htm');
    await transferPage.expectErrorDisplayed();
  });
});

