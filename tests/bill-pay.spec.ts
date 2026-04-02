import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { BillPayPage } from '../pages/BillPayPage';

const USERNAME = 'john';
const PASSWORD = 'demo';
const FULL_NAME = 'John Smith';

test.describe('Bill Pay', () => {
  test('user can pay a bill', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);
    const billPayPage = new BillPayPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);

    await overviewPage.goToBillPay();
    await billPayPage.expectLoaded();
    await billPayPage.waitForAccounts();
    await billPayPage.payBill({
      name: 'Electric Company',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      phone: '5551234567',
      accountNumber: '54321',
      amount: '55',
    });
    await billPayPage.expectPaymentComplete('Electric Company', '55.00');
  });
});
