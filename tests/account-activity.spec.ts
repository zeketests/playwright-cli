import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { AccountActivityPage } from '../pages/AccountActivityPage';

const USERNAME = 'john';
const PASSWORD = 'demo';
const FULL_NAME = 'John Smith';

test.describe('Account Activity', () => {
  test('user can view account activity after a transaction', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);
    const transferPage = new TransferFundsPage(page);
    const activityPage = new AccountActivityPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);

    // Create a transaction so the activity table has at least one row
    await overviewPage.goToTransferFunds();
    await transferPage.expectLoaded();
    await transferPage.waitForAccounts();
    const fromOptions = await transferPage.getFromAccountOptions();
    const toOptions = await transferPage.getToAccountOptions();
    const fromAccount = fromOptions[0];
    const toAccount = toOptions[1];
    await transferPage.transfer('29', fromAccount, toAccount);
    await transferPage.expectTransferSuccess('29.00', fromAccount, toAccount);

    // Navigate to that account's activity page
    await activityPage.goto(fromAccount);
    await activityPage.expectLoaded(fromAccount);
    await activityPage.expectTransactionTableVisible();
  });
});
