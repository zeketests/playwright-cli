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
    await loanPage.applyForLoan('1000', '100');
    await loanPage.expectLoanProcessed();
  });
});
