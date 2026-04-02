import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';

const USERNAME = 'john';
const PASSWORD = 'demo';
const FULL_NAME = 'John Smith';

test.describe('Authentication', () => {
  test('user can log in and view accounts overview', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const overviewPage = new AccountsOverviewPage(page);

    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);
    await overviewPage.expectLoaded(FULL_NAME);
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
