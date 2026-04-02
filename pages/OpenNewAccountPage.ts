import { type Page, type Locator, expect } from '@playwright/test';

export class OpenNewAccountPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly accountTypeSelect: Locator;
  readonly fromAccountSelect: Locator;
  readonly openButton: Locator;
  readonly successHeading: Locator;
  readonly newAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Open New Account' });
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.openButton = page.getByRole('button', { name: 'Open New Account' });
    this.successHeading = page.getByRole('heading', { name: 'Account Opened!' });
    this.newAccountLink = page
      .locator('p')
      .filter({ hasText: 'Your new account number:' })
      .getByRole('link');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/openaccount\.htm/);
    await expect(this.heading).toBeVisible();
  }

  async waitForAccounts() {
    await expect(this.fromAccountSelect.locator('option').first()).toBeAttached();
  }

  async openAccount(type: 'CHECKING' | 'SAVINGS') {
    await this.accountTypeSelect.selectOption(type);
    await this.openButton.click();
  }

  async expectAccountOpened(): Promise<string> {
    await expect(this.successHeading).toBeVisible();
    await expect(this.page.getByText('Congratulations, your account is now open.')).toBeVisible();
    await expect(this.newAccountLink).toBeVisible();
    return (await this.newAccountLink.textContent())?.trim() ?? '';
  }
}
