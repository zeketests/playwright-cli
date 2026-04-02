import { type Page, type Locator, expect } from '@playwright/test';

export interface BillPayDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  accountNumber: string;
  amount: string;
}

export class BillPayPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly payeeNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly accountNumberInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly sendPaymentButton: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Bill Payment Service' });
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.addressInput = page.locator('input[name="payee.address.street"]');
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.phoneInput = page.locator('input[name="payee.phoneNumber"]');
    this.accountNumberInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.getByRole('button', { name: 'Send Payment' });
    this.successHeading = page.getByRole('heading', { name: 'Bill Payment Complete' });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/billpay\.htm/);
    await expect(this.heading).toBeVisible();
  }

  async waitForAccounts() {
    await expect(this.fromAccountSelect.locator('option').first()).toBeAttached();
  }

  async payBill(details: BillPayDetails) {
    await this.payeeNameInput.fill(details.name);
    await this.addressInput.fill(details.address);
    await this.cityInput.fill(details.city);
    await this.stateInput.fill(details.state);
    await this.zipCodeInput.fill(details.zipCode);
    await this.phoneInput.fill(details.phone);
    await this.accountNumberInput.fill(details.accountNumber);
    await this.verifyAccountInput.fill(details.accountNumber);
    await this.amountInput.fill(details.amount);
    await this.sendPaymentButton.click();
  }

  async expectPaymentComplete(payeeName: string, amount: string) {
    await expect(this.successHeading).toBeVisible();
    await expect(
      this.page.getByText(`Bill Payment to ${payeeName} in the amount of $${amount}`)
    ).toBeVisible();
  }
}
