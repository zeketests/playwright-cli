# Playwright CLI — ParaBank Test Suite

A browser automation and testing framework using `playwright-cli` and `@playwright/test`, targeting the [ParaBank](https://parabank.parasoft.com/parabank/index.htm) demo banking application. Tests are structured using the **Page Object Model (POM)**, results are reported via **Allure**, and the report is hosted live on **GitHub Pages**.

> **Live Allure Report:** [https://zeketests.github.io/playwright-cli/](https://zeketests.github.io/playwright-cli/)

---

## Table of Contents

1. [What is playwright-cli?](#what-is-playwright-cli)
2. [Why CLI Testing?](#why-cli-testing)
3. [Installation](#installation)
4. [Project Setup](#project-setup)
5. [Project Structure](#project-structure)
6. [Basic Commands Reference](#basic-commands-reference)
7. [CLI Testing Guide](#cli-testing-guide)
8. [About the Application Under Test](#about-the-application-under-test)
9. [Running the Tests](#running-the-tests)
10. [Allure Reports](#allure-reports)
11. [CI/CD — GitHub Actions](#cicd--github-actions)

---

## What is playwright-cli?

`playwright-cli` is a command-line interface for [Playwright](https://playwright.dev/) that lets you drive a real browser interactively from your terminal — one command at a time. It exposes every Playwright browser action as a short shell command.

Each command communicates with a persistent browser session. After every action, `playwright-cli` returns a **YAML accessibility snapshot** of the page — a structured, text-based representation of all visible elements with stable `ref` IDs (e.g. `e15`, `e42`). You use these refs to target elements in follow-up commands, without having to know CSS selectors upfront.

```bash
playwright-cli open https://example.com
playwright-cli snapshot          # see the page tree and element refs
playwright-cli click e15         # click element with ref e15
playwright-cli fill e22 "hello"  # type into a field
playwright-cli close
```

---

## Why CLI Testing?

| Benefit | Description |
|---|---|
| **Zero code exploration** | Explore any website interactively before writing a single line of test code |
| **Instant feedback** | Every command shows exactly what changed on the page in real-time |
| **AI-friendly** | The YAML snapshot format is structured and readable by both humans and AI agents, making it ideal for AI-assisted test generation |
| **Fast iteration** | Debug failing flows without re-running an entire test suite |
| **Browser agnostic** | Supports Chromium, Firefox, WebKit and Chrome/Edge channels with a single flag |
| **No DOM knowledge needed** | Snapshot refs let you target elements without inspecting the source HTML |
| **Scriptable** | Commands can be chained in shell scripts or used within CI pipelines |
| **State management** | Save and restore cookies, localStorage and session storage to speed up flows that require authentication |

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later
- [Allure CLI](https://allurereport.org/docs/install/) (for local report generation — requires Java)

### 1. Install playwright-cli globally

```bash
npm install -g @playwright/cli@latest
```

Verify the installation:

```bash
playwright-cli --version
```

> If you prefer not to install globally, use it via `npx`:
> ```bash
> npx playwright-cli open https://example.com
> ```

### 2. Install Playwright browsers

```bash
npx playwright install
```

To install a specific browser only:

```bash
npx playwright install chromium
```

### 3. Install Allure CLI (macOS)

```bash
brew install allure
```

---

## Project Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/zeketests/playwright-cli.git
cd playwright-cli
npm install
```

---

## Project Structure

```
playwright-cli/
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI workflow
├── pages/                       # Page Object Model classes
│   ├── LoginPage.ts
│   ├── AccountsOverviewPage.ts
│   └── TransferFundsPage.ts
├── tests/
│   ├── global-setup.ts          # Auto-initializes ParaBank DB before tests
│   └── parabank.spec.ts         # ParaBank critical workflow tests
├── playwright.config.ts         # Playwright configuration
├── package.json
└── README.md
```

### Page Objects

| File | Responsibility |
|---|---|
| `LoginPage.ts` | Login form interactions, error assertion |
| `AccountsOverviewPage.ts` | Account table, navigation links, logout |
| `TransferFundsPage.ts` | Transfer form, AJAX dropdown handling, success assertion |

### Global Setup

`tests/global-setup.ts` runs automatically before every test suite. It:
1. Sets the ParaBank server's **Data Access Mode to JDBC**
2. **Initializes the database** — restoring the default `john`/`demo` user

This prevents test failures caused by the shared public server being in an unexpected state.

---

## Basic Commands Reference

### Opening and navigating

```bash
playwright-cli open                                  # open a blank browser
playwright-cli open https://example.com              # open and navigate immediately
playwright-cli open --headed https://example.com     # open in headed (visible) mode
playwright-cli open --browser=firefox https://example.com
playwright-cli goto https://other-page.com           # navigate existing session
playwright-cli go-back
playwright-cli go-forward
playwright-cli reload
playwright-cli close
```

### Inspecting the page

```bash
playwright-cli snapshot                  # full page YAML snapshot with element refs
playwright-cli snapshot --depth=4        # limit tree depth for large pages
playwright-cli snapshot "#main"          # snapshot a specific element
playwright-cli snapshot e34              # snapshot a ref from a previous snapshot
playwright-cli eval "document.title"     # run arbitrary JavaScript
playwright-cli eval "el => el.id" e5     # run JS against a specific element
```

### Interacting with elements

```bash
playwright-cli click e15                         # click by ref
playwright-cli click "#submit-button"            # click by CSS selector
playwright-cli click "getByRole('button', { name: 'Submit' })"
playwright-cli dblclick e7
playwright-cli fill e5 "user@example.com"
playwright-cli fill e5 "user@example.com" --submit   # fill and press Enter
playwright-cli type "search query"               # type into the focused element
playwright-cli select e9 "option-value"          # select a dropdown option
playwright-cli check e12
playwright-cli uncheck e12
playwright-cli hover e4
playwright-cli drag e2 e8
playwright-cli upload ./file.pdf
```

### Keyboard and mouse

```bash
playwright-cli press Enter
playwright-cli press ArrowDown
playwright-cli keydown Shift
playwright-cli keyup Shift
playwright-cli mousemove 150 300
playwright-cli mousedown
playwright-cli mouseup
playwright-cli mousewheel 0 100
```

### Dialogs

```bash
playwright-cli dialog-accept
playwright-cli dialog-accept "confirmation text"
playwright-cli dialog-dismiss
```

### Screenshots and PDFs

```bash
playwright-cli screenshot
playwright-cli screenshot e5                     # screenshot a specific element
playwright-cli screenshot --filename=page.png
playwright-cli pdf --filename=page.pdf
```

### Tabs

```bash
playwright-cli tab-new https://example.com
playwright-cli tab-list
playwright-cli tab-select 0
playwright-cli tab-close
```

### Storage state (cookies, localStorage)

```bash
playwright-cli state-save auth.json             # save full browser state
playwright-cli state-load auth.json             # restore browser state

playwright-cli cookie-list
playwright-cli cookie-set session_id abc123 --domain=example.com --httpOnly --secure
playwright-cli cookie-delete session_id

playwright-cli localstorage-list
playwright-cli localstorage-set theme dark
playwright-cli localstorage-get theme

playwright-cli sessionstorage-set step 3
```

### Network mocking

```bash
playwright-cli route "**/*.jpg" --status=404
playwright-cli route "https://api.example.com/**" --body='{"mock": true}'
playwright-cli route-list
playwright-cli unroute "**/*.jpg"
playwright-cli unroute                           # remove all routes
```

### DevTools and tracing

```bash
playwright-cli console                  # print browser console output
playwright-cli console warning          # filter by level
playwright-cli network                  # show network requests
playwright-cli tracing-start
playwright-cli tracing-stop
playwright-cli video-start video.webm
playwright-cli video-stop
```

### Session management

```bash
playwright-cli list                     # list all open browser sessions
playwright-cli -s=mysession open https://example.com --persistent
playwright-cli -s=mysession click e6
playwright-cli -s=mysession close
playwright-cli close-all
playwright-cli kill-all                 # forcefully kill all browser processes
```

---

## CLI Testing Guide

### Step 1 — Explore the page

Open a browser and take a snapshot to understand the page structure:

```bash
playwright-cli open --headed https://parabank.parasoft.com/parabank/index.htm
playwright-cli snapshot
```

The snapshot returns a YAML tree of all accessible elements with short `ref` IDs. Use these IDs in follow-up commands.

### Step 2 — Interact step by step

Drive the page manually, one action at a time. Each command shows the updated page state:

```bash
playwright-cli fill e34 "john"
playwright-cli fill e37 "demo"
playwright-cli click e39
# Snapshot shows the logged-in Accounts Overview page
```

### Step 3 — Inspect elements more deeply

When a ref's label doesn't tell you everything, use `eval` to read any attribute:

```bash
playwright-cli eval "el => el.getAttribute('data-testid')" e5
playwright-cli eval "el => el.id" e22
```

### Step 4 — Translate to a Playwright test

Once you've mapped out a flow in the CLI, translate each action into `@playwright/test` code using Page Objects:

| CLI | Page Object method |
|---|---|
| `playwright-cli fill e34 "john"` + `playwright-cli fill e37 "demo"` + `playwright-cli click e39` | `await loginPage.login('john', 'demo')` |
| `playwright-cli click e37` (Transfer Funds link) | `await overviewPage.goToTransferFunds()` |
| `playwright-cli click e47` (Log Out link) | `await overviewPage.logout()` |

### Step 5 — Save state to skip login

```bash
playwright-cli open https://parabank.parasoft.com/parabank/index.htm
playwright-cli fill e34 "john"
playwright-cli fill e37 "demo"
playwright-cli click e39
playwright-cli state-save auth.json
playwright-cli close

# Later, skip login entirely:
playwright-cli open https://parabank.parasoft.com/parabank/overview.htm
playwright-cli state-load auth.json
```

### Step 6 — Debug a failing test

```bash
playwright-cli open --headed https://parabank.parasoft.com/parabank/transfer.htm
playwright-cli state-load auth.json
playwright-cli snapshot          # compare against expected state
playwright-cli console           # check for JS errors
playwright-cli network           # check for failed API calls
```

---

## About the Application Under Test

[ParaBank](https://parabank.parasoft.com/parabank/index.htm) is a publicly available demo banking application maintained by Parasoft, designed as a target for web automation, API testing, and security testing.

### Key pages

| Feature | URL |
|---|---|
| Home / Login | `/index.htm` |
| Register new user | `/register.htm` |
| Accounts Overview | `/overview.htm` |
| Transfer Funds | `/transfer.htm` |
| Bill Pay | `/billpay.htm` |
| Find Transactions | `/findtrans.htm` |
| Request Loan | `/requestloan.htm` |
| Update Contact Info | `/updateprofile.htm` |
| Admin / DB Reset | `/admin.htm` |

### Test credentials

| Field | Value |
|---|---|
| Username | `john` |
| Password | `demo` |

> ParaBank runs on a shared public server. The database is automatically reset to a known state by `global-setup.ts` before every test run, so credentials are always valid.

### Critical workflow covered by this suite

1. **Login** — authenticate with valid credentials
2. **Accounts Overview** — verify accounts table is visible and populated
3. **Fund Transfer** — transfer between two accounts, assert success message
4. **Invalid login** — assert correct error message for bad credentials
5. **Logout** — assert redirect back to the login page

---

## Running the Tests

```bash
# Run the ParaBank suite on Chromium (recommended)
npm test

# Run all tests across all browsers
npm run test:all

# Run against a specific browser
npx playwright test tests/parabank.spec.ts --project=chromium
npx playwright test tests/parabank.spec.ts --project=firefox
npx playwright test tests/parabank.spec.ts --project=webkit

# Run in headed mode (visible browser window)
npx playwright test tests/parabank.spec.ts --headed

# Run a single test by name
npx playwright test -g "user can transfer funds between accounts"

# Debug mode (step through each action)
npx playwright test tests/parabank.spec.ts --debug
```

---

## Allure Reports

### Local

```bash
# 1. Run tests (produces allure-results/)
npm test

# 2. Generate the HTML report
npm run allure:generate

# 3. Open in browser
npm run allure:open

# Or serve directly from the raw results (no generate step needed)
npm run allure:serve
```

### Live (GitHub Pages)

The Allure report for the latest CI run is always available at:

> **https://zeketests.github.io/playwright-cli/**

It updates automatically on every push to `main` and includes **historical trend data** across runs.

---

## CI/CD — GitHub Actions

The workflow at [.github/workflows/playwright.yml](.github/workflows/playwright.yml) triggers on every push to `main` and:

1. Installs dependencies and Chromium
2. Runs the ParaBank test suite (with global setup)
3. Fetches Allure history from the previous run (for trend charts)
4. Generates a fresh Allure report
5. Deploys it to **GitHub Pages**
6. Uploads both the Allure report and the Playwright HTML report as downloadable artifacts

| Artifact | Contents |
|---|---|
| `allure-report` | Full Allure HTML report (downloadable) |
| `playwright-report` | Playwright built-in HTML report (downloadable) |


---

## Table of Contents

1. [What is playwright-cli?](#what-is-playwright-cli)
2. [Why CLI Testing?](#why-cli-testing)
3. [Installation](#installation)
4. [Project Setup](#project-setup)
5. [Basic Commands Reference](#basic-commands-reference)
6. [CLI Testing Guide](#cli-testing-guide)
7. [About the Application Under Test](#about-the-application-under-test)
8. [Running the Tests](#running-the-tests)

---

## What is playwright-cli?

`playwright-cli` is a command-line interface for [Playwright](https://playwright.dev/) that lets you drive a real browser interactively from your terminal — one command at a time. It exposes every Playwright browser action as a short shell command.

Each command communicates with a persistent browser session. After every action, `playwright-cli` returns a **YAML accessibility snapshot** of the page — a structured, text-based representation of all visible elements with stable `ref` IDs (e.g. `e15`, `e42`). You use these refs to target elements in follow-up commands, without having to know CSS selectors upfront.

```
playwright-cli open https://example.com
playwright-cli snapshot          # see the page tree and element refs
playwright-cli click e15         # click element with ref e15
playwright-cli fill e22 "hello"  # type into a field
playwright-cli close
```

---

## Why CLI Testing?

| Benefit | Description |
|---|---|
| **Zero code exploration** | Explore any website interactively before writing a single line of test code |
| **Instant feedback** | Every command shows exactly what changed on the page in real-time |
| **AI-friendly** | The YAML snapshot format is structured and readable by both humans and AI agents, making it ideal for AI-assisted test generation |
| **Fast iteration** | Debug failing flows without re-running an entire test suite |
| **Browser agnostic** | Supports Chromium, Firefox, WebKit and Chrome/Edge channels with a single flag |
| **No DOM knowledge needed** | Snapshot refs let you target elements without inspecting the source HTML |
| **Scriptable** | Commands can be chained in shell scripts or used within CI pipelines |
| **State management** | Save and restore cookies, localStorage and session storage to speed up flows that require authentication |

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### 1. Install playwright-cli globally

```bash
npm install -g @playwright/cli@latest
```

Verify the installation:

```bash
playwright-cli --version
```

> If you prefer not to install globally, you can use it via `npx`:
> ```bash
> npx playwright-cli open https://example.com
> ```

### 2. Install Playwright browsers

```bash
npx playwright install
```

To install a specific browser only:

```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

---

## Project Setup

Clone the repository and install dependencies:

```bash
npm install
```

This installs `@playwright/test` for running the `.spec.ts` test files.

**Project structure:**

```
playwright-cli/
├── tests/
│   ├── example.spec.ts      # default Playwright example tests
│   └── parabank.spec.ts     # ParaBank critical workflow tests
├── playwright.config.ts     # Playwright test runner configuration
├── package.json
└── README.md
```

---

## Basic Commands Reference

### Opening and navigating

```bash
playwright-cli open                                  # open a blank browser
playwright-cli open https://example.com              # open and navigate immediately
playwright-cli open --headed https://example.com     # open in headed (visible) mode
playwright-cli open --browser=firefox https://example.com
playwright-cli goto https://other-page.com           # navigate existing session
playwright-cli go-back
playwright-cli go-forward
playwright-cli reload
playwright-cli close
```

### Inspecting the page

```bash
playwright-cli snapshot                  # full page YAML snapshot with element refs
playwright-cli snapshot --depth=4        # limit tree depth for large pages
playwright-cli snapshot "#main"          # snapshot a specific element
playwright-cli snapshot e34              # snapshot a ref from a previous snapshot
playwright-cli eval "document.title"     # run arbitrary JavaScript
playwright-cli eval "el => el.id" e5     # run JS against a specific element
```

### Interacting with elements

```bash
playwright-cli click e15                         # click by ref
playwright-cli click "#submit-button"            # click by CSS selector
playwright-cli click "getByRole('button', { name: 'Submit' })"
playwright-cli dblclick e7
playwright-cli fill e5 "user@example.com"
playwright-cli fill e5 "user@example.com" --submit   # fill and press Enter
playwright-cli type "search query"               # type into the focused element
playwright-cli select e9 "option-value"          # select a dropdown option
playwright-cli check e12
playwright-cli uncheck e12
playwright-cli hover e4
playwright-cli drag e2 e8
playwright-cli upload ./file.pdf
```

### Keyboard and mouse

```bash
playwright-cli press Enter
playwright-cli press ArrowDown
playwright-cli keydown Shift
playwright-cli keyup Shift
playwright-cli mousemove 150 300
playwright-cli mousedown
playwright-cli mousedown right
playwright-cli mouseup
playwright-cli mousewheel 0 100
```

### Dialogs

```bash
playwright-cli dialog-accept
playwright-cli dialog-accept "confirmation text"
playwright-cli dialog-dismiss
```

### Screenshots and PDFs

```bash
playwright-cli screenshot
playwright-cli screenshot e5                     # screenshot a specific element
playwright-cli screenshot --filename=page.png
playwright-cli pdf --filename=page.pdf
```

### Tabs

```bash
playwright-cli tab-new https://example.com
playwright-cli tab-list
playwright-cli tab-select 0
playwright-cli tab-close
```

### Storage state (cookies, localStorage)

```bash
playwright-cli state-save auth.json             # save full browser state
playwright-cli state-load auth.json             # restore browser state

playwright-cli cookie-list
playwright-cli cookie-set session_id abc123 --domain=example.com --httpOnly --secure
playwright-cli cookie-delete session_id

playwright-cli localstorage-list
playwright-cli localstorage-set theme dark
playwright-cli localstorage-get theme

playwright-cli sessionstorage-set step 3
```

### Network mocking

```bash
playwright-cli route "**/*.jpg" --status=404
playwright-cli route "https://api.example.com/**" --body='{"mock": true}'
playwright-cli route-list
playwright-cli unroute "**/*.jpg"
playwright-cli unroute                           # remove all routes
```

### DevTools and tracing

```bash
playwright-cli console                  # print browser console output
playwright-cli console warning          # filter by level
playwright-cli network                  # show network requests
playwright-cli tracing-start
playwright-cli tracing-stop
playwright-cli video-start video.webm
playwright-cli video-stop
```

### Session management

```bash
playwright-cli list                     # list all open browser sessions
playwright-cli -s=mysession open https://example.com --persistent
playwright-cli -s=mysession click e6
playwright-cli -s=mysession close
playwright-cli close-all
playwright-cli kill-all                 # forcefully kill all browser processes
```

---

## CLI Testing Guide

### Step 1 — Explore the page

Open a browser and take a snapshot to understand the page structure:

```bash
playwright-cli open --headed https://example.com
playwright-cli snapshot
```

The snapshot returns a YAML tree of all accessible elements with short `ref` IDs. Use these IDs in follow-up commands.

### Step 2 — Interact step by step

Drive the page manually, one action at a time. Each command prints a new snapshot so you always see the current state:

```bash
playwright-cli fill e34 "john"
playwright-cli fill e37 "demo"
playwright-cli click e39
# Snapshot shows the logged-in page after clicking Log In
```

### Step 3 — Inspect elements more deeply

When a ref's label doesn't tell you everything, use `eval` to read any attribute:

```bash
playwright-cli eval "el => el.getAttribute('data-testid')" e5
playwright-cli eval "el => el.id" e22
```

### Step 4 — Generate a Playwright test

Once you've mapped out a flow in the CLI, translate each action into `@playwright/test` code. CLI refs map directly to stable Playwright locators:

| CLI | Playwright test code |
|---|---|
| `playwright-cli fill e34 "john"` | `await page.locator('input[name="username"]').fill('john')` |
| `playwright-cli click e39` | `await page.getByRole('button', { name: 'Log In' }).click()` |
| `playwright-cli select e56 "13344"` | `await page.locator('#fromAccountId').selectOption('13344')` |

### Step 5 — Save state to skip repetitive steps

For tests that always start authenticated, save the login state once and reuse it:

```bash
playwright-cli open https://parabank.parasoft.com/parabank/index.htm
playwright-cli fill e34 "john"
playwright-cli fill e37 "demo"
playwright-cli click e39
playwright-cli state-save auth.json
playwright-cli close
```

Then in any future session, load the state to skip the login flow:

```bash
playwright-cli open https://parabank.parasoft.com/parabank/overview.htm
playwright-cli state-load auth.json
playwright-cli snapshot
```

### Step 6 — Debug a failing test

When a test fails, replay the exact steps in the CLI to observe the actual page state:

```bash
playwright-cli open --headed https://parabank.parasoft.com/parabank/transfer.htm
playwright-cli state-load auth.json
playwright-cli snapshot          # compare against expected state
playwright-cli console           # check for JS errors
playwright-cli network           # check for failed API calls
```

---

## About the Application Under Test

[ParaBank](https://parabank.parasoft.com/parabank/index.htm) is a publicly available demo banking application maintained by Parasoft. It is designed specifically as a test target for practising web automation, API testing, and security testing.

### Key features

| Feature | URL |
|---|---|
| Home / Login | `/index.htm` |
| Register new user | `/register.htm` |
| Accounts Overview | `/overview.htm` |
| Transfer Funds | `/transfer.htm` |
| Bill Pay | `/billpay.htm` |
| Find Transactions | `/findtrans.htm` |
| Request Loan | `/requestloan.htm` |
| Update Contact Info | `/updateprofile.htm` |

### Test credentials

The default demo user available on a freshly initialised instance:

| Field | Value |
|---|---|
| Username | `john` |
| Password | `demo` |

> The application runs on a shared public server. Account balances and data may change between sessions as other users interact with the same instance. The Admin Page (`/admin.htm`) can be used to initialise or reset the database.

### Critical workflow covered by this test suite

The most important end-to-end path in a banking application is:

1. **Login** — authenticate with valid credentials
2. **Accounts Overview** — verify accounts are visible and accessible
3. **Fund Transfer** — move money between two accounts and confirm success
4. **Logout** — securely end the session

This is covered in [tests/parabank.spec.ts](tests/parabank.spec.ts).

---

## Running the Tests

Run all tests across all configured browsers:

```bash
npx playwright test
```

Run only the ParaBank suite:

```bash
npx playwright test tests/parabank.spec.ts
```

Run against a single browser:

```bash
npx playwright test tests/parabank.spec.ts --project=chromium
npx playwright test tests/parabank.spec.ts --project=firefox
npx playwright test tests/parabank.spec.ts --project=webkit
```

Run in headed mode (visible browser window):

```bash
npx playwright test tests/parabank.spec.ts --headed
```

Run a single test by name:

```bash
npx playwright test -g "user can transfer funds between accounts"
```

Open the HTML report after a run:

```bash
npx playwright show-report
```

Run with debug mode (step through each action):

```bash
npx playwright test tests/parabank.spec.ts --debug
```
