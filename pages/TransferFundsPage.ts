import { type Page, type Locator, expect } from '@playwright/test';

export class TransferFundsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly transferButton: Locator;
  readonly successHeading: Locator;
  readonly errorHeading: Locator;
  readonly activityMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Transfer Funds' });
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.transferButton = page.getByRole('button', { name: 'Transfer' });
    this.successHeading = page.getByRole('heading', { name: 'Transfer Complete!' });
    this.errorHeading = page.getByRole('heading', { name: 'Error!' });
    this.activityMessage = page.getByText('See Account Activity for more details.');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/transfer\.htm/);
    await expect(this.heading).toBeVisible();
  }

  async waitForAccounts() {
    // Account dropdowns are populated dynamically via AJAX
    await expect(this.fromAccountSelect.locator('option').first()).toBeAttached();
    await expect(this.toAccountSelect.locator('option').nth(1)).toBeAttached();
  }

  async getFromAccountOptions(): Promise<string[]> {
    return (await this.fromAccountSelect.locator('option').allTextContents()).map(o => o.trim());
  }

  async getToAccountOptions(): Promise<string[]> {
    return (await this.toAccountSelect.locator('option').allTextContents()).map(o => o.trim());
  }

  async transfer(amount: string, fromAccount: string, toAccount: string) {
    await this.amountInput.fill(amount);
    await this.fromAccountSelect.selectOption(fromAccount);
    await this.toAccountSelect.selectOption(toAccount);
    await this.transferButton.click();
  }

  async expectTransferSuccess(amount: string, fromAccount: string, toAccount: string) {
    await expect(this.successHeading).toBeVisible();
    await expect(
      this.page.getByText(`$${amount} has been transferred from account #${fromAccount} to account #${toAccount}.`)
    ).toBeVisible();
  }

  async expectErrorDisplayed() {
    await expect(this.errorHeading).toBeVisible();
  }

  async expectActivityMessageVisible() {
    await expect(this.activityMessage).toBeVisible();
  }
}
