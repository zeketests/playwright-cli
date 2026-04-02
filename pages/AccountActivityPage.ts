import { type Page, type Locator, expect } from '@playwright/test';

export class AccountActivityPage {
  readonly page: Page;
  readonly accountDetailsHeading: Locator;
  readonly accountActivityHeading: Locator;
  readonly transactionRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountDetailsHeading = page.getByRole('heading', { name: 'Account Details' });
    this.accountActivityHeading = page.getByRole('heading', { name: 'Account Activity' });
    this.transactionRows = page
      .getByRole('table')
      .filter({ has: page.getByRole('columnheader', { name: 'Transaction' }) })
      .locator('tbody tr');
  }

  async goto(accountId: string) {
    await this.page.goto(
      `https://parabank.parasoft.com/parabank/activity.htm?id=${accountId}`
    );
  }

  async expectLoaded(accountNumber: string) {
    await expect(this.page).toHaveURL(new RegExp(`/activity\\.htm\\?id=${accountNumber}`));
    await expect(this.page).toHaveTitle('ParaBank | Account Activity');
    await expect(this.accountDetailsHeading).toBeVisible();
    await expect(this.page.getByRole('cell', { name: accountNumber })).toBeVisible();
  }

  async expectTransactionTableVisible() {
    await expect(this.accountActivityHeading).toBeVisible();
    await expect(this.transactionRows).not.toHaveCount(0);
  }
}
