import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { FindTransactionsPage } from '../pages/FindTransactionsPage';

const USERNAME = 'john';
const PASSWORD = 'demo';
const FULL_NAME = 'John Smith';

test.describe('Find Transactions', () => {
  test('user can find transactions by date range', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);
    const transferPage = new TransferFundsPage(page);
    const findTransPage = new FindTransactionsPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);

    // Create a transaction so there is activity within the date range
    await overviewPage.goToTransferFunds();
    await transferPage.expectLoaded();
    await transferPage.waitForAccounts();
    const fromOptions = await transferPage.getFromAccountOptions();
    const toOptions = await transferPage.getToAccountOptions();
    const fromAccount = fromOptions[0];
    const toAccount = toOptions[1];
    await transferPage.transfer('43', fromAccount, toAccount);
    await transferPage.expectTransferSuccess('43.00', fromAccount, toAccount);

    // Search for transactions within a date range covering today
    await findTransPage.goto();
    await findTransPage.expectLoaded();
    await findTransPage.findByDateRange(fromAccount, '01-01-2026', '12-31-2026');
    await findTransPage.expectResultsVisible();
  });

  test('user can find transactions by amount', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);
    const transferPage = new TransferFundsPage(page);
    const findTransPage = new FindTransactionsPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);

    // Create a transaction with a specific amount to search for
    await overviewPage.goToTransferFunds();
    await transferPage.expectLoaded();
    await transferPage.waitForAccounts();
    const fromOptions = await transferPage.getFromAccountOptions();
    const toOptions = await transferPage.getToAccountOptions();
    const fromAccount = fromOptions[0];
    const toAccount = toOptions[1];
    await transferPage.transfer('37', fromAccount, toAccount);
    await transferPage.expectTransferSuccess('37.00', fromAccount, toAccount);

    // Search for that transaction
    await findTransPage.goto();
    await findTransPage.expectLoaded();
    await findTransPage.findByAmount(fromAccount, '37');
    await findTransPage.expectResultsVisible();
  });
});
