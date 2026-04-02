import { type Page, type Locator, expect } from '@playwright/test';

export class AccountsOverviewPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly accountRows: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly openNewAccountLink: Locator;
  readonly findTransactionsLink: Locator;
  readonly requestLoanLink: Locator;
  readonly logOutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Accounts Overview' });
    this.accountRows = page.locator('table tbody tr');
    this.transferFundsLink = page.getByRole('link', { name: 'Transfer Funds' });
    this.billPayLink = page.getByRole('link', { name: 'Bill Pay' });
    this.openNewAccountLink = page.getByRole('link', { name: 'Open New Account' });
    this.findTransactionsLink = page.getByRole('link', { name: 'Find Transactions' });
    this.requestLoanLink = page.getByRole('link', { name: 'Request Loan' });
    this.logOutLink = page.getByRole('link', { name: 'Log Out' });
  }

  async expectLoaded(username: string) {
    await expect(this.page).toHaveURL(/\/overview\.htm/);
    await expect(this.page).toHaveTitle('ParaBank | Accounts Overview');
    await expect(this.page.getByText(`Welcome ${username}`)).toBeVisible();
    await expect(this.heading).toBeVisible();
    await expect(this.accountRows).not.toHaveCount(0);
  }

  async logout() {
    await this.logOutLink.click();
  }

  async goToTransferFunds() {
    await this.transferFundsLink.click();
  }
}
