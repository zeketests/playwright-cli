import { type Page, type Locator, expect } from '@playwright/test';

export class RequestLoanPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly loanAmountInput: Locator;
  readonly downPaymentInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly applyButton: Locator;
  readonly successHeading: Locator;
  readonly loanStatusCell: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Apply for a Loan' });
    this.loanAmountInput = page.locator('#amount');
    this.downPaymentInput = page.locator('#downPayment');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.applyButton = page.getByRole('button', { name: 'Apply Now' });
    this.successHeading = page.getByRole('heading', { name: 'Loan Request Processed' });
    this.loanStatusCell = page.getByRole('cell', { name: /Approved|Denied/ });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/requestloan\.htm/);
    await expect(this.heading).toBeVisible();
  }

  async waitForAccounts() {
    await expect(this.fromAccountSelect.locator('option').first()).toBeAttached();
  }

  async getFromAccountOptions(): Promise<string[]> {
    return (await this.fromAccountSelect.locator('option').allTextContents()).map(o => o.trim());
  }

  async applyForLoan(amount: string, downPayment: string, fromAccount?: string) {
    await this.loanAmountInput.fill(amount);
    await this.downPaymentInput.fill(downPayment);
    if (fromAccount) {
      await this.fromAccountSelect.selectOption(fromAccount);
    }
    await this.applyButton.click();
  }

  async expectLoanProcessed() {
    await expect(this.successHeading).toBeVisible({ timeout: 20000 });
    await expect(this.loanStatusCell).toBeVisible({ timeout: 20000 });
  }
}
