import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { OpenNewAccountPage } from '../pages/OpenNewAccountPage';

const USERNAME = 'john';
const PASSWORD = 'demo';
const FULL_NAME = 'John Smith';

test.describe('Open New Account', () => {
  test('user can open a new checking account', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);
    const openAccountPage = new OpenNewAccountPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);

    await overviewPage.goToOpenNewAccount();
    await openAccountPage.expectLoaded();
    await openAccountPage.waitForAccounts();
    await openAccountPage.openAccount('CHECKING');
    await openAccountPage.expectAccountOpened();
  });

  test('user can open a new savings account', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);
    const openAccountPage = new OpenNewAccountPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);

    await overviewPage.goToOpenNewAccount();
    await openAccountPage.expectLoaded();
    await openAccountPage.waitForAccounts();
    await openAccountPage.openAccount('SAVINGS');
    await openAccountPage.expectAccountOpened();
  });
});
