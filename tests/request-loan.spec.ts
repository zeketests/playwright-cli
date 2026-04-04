import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { RequestLoanPage } from '../pages/RequestLoanPage';

const USERNAME = 'john';
const PASSWORD = 'demo';
const FULL_NAME = 'John Smith';

test.describe('Request Loan', () => {
  test('user can request a loan and receive approval', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);
    const loanPage = new RequestLoanPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);

    await overviewPage.goToRequestLoan();
    await loanPage.expectLoaded();
    await loanPage.waitForAccounts();
    const fromOptions = await loanPage.getFromAccountOptions();
    // Use the last account — other tests drain fromOptions[0] (account 12345) as their from-account
    const fromAccount = fromOptions[fromOptions.length - 1];
    await loanPage.applyForLoan('1000', '100', fromAccount);
    await loanPage.expectLoanProcessed();
  });
});
