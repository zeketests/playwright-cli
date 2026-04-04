import { type Page, type Locator, expect } from '@playwright/test';

export class FindTransactionsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly accountSelect: Locator;
  readonly amountInput: Locator;
  readonly findByAmountButton: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly findByDateRangeButton: Locator;
  readonly resultsTable: Locator;
  readonly transactionRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Find Transactions' });
    this.accountSelect = page.locator('#accountId');
    this.amountInput = page.locator('#amount');
    this.findByAmountButton = page.locator('#findByAmount');
    this.fromDateInput = page.locator('#fromDate');
    this.toDateInput = page.locator('#toDate');
    this.findByDateRangeButton = page.locator('#findByDateRange');
    this.resultsTable = page.getByRole('table').filter({
      has: page.getByRole('columnheader', { name: 'Transaction' }),
    });
    this.transactionRows = this.resultsTable.locator('tbody tr');
  }

  async goto() {
    await this.page.goto('https://parabank.parasoft.com/parabank/findtrans.htm');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/findtrans\.htm/);
    await expect(this.heading).toBeVisible();
  }

  async findByAmount(accountNumber: string, amount: string) {
    await this.accountSelect.selectOption(accountNumber);
    await this.amountInput.fill(amount);
    await this.findByAmountButton.click();
  }

  async findByDateRange(accountNumber: string, fromDate: string, toDate: string) {
    await this.accountSelect.selectOption(accountNumber);
    await this.fromDateInput.fill(fromDate);
    await this.toDateInput.fill(toDate);
    await this.findByDateRangeButton.click();
  }

  async expectResultsVisible() {
    await expect(this.resultsTable).toBeVisible();
    await expect(this.transactionRows).not.toHaveCount(0);
  }
}
