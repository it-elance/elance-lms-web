# Elance LMS Web

A modern Learning Management System built with the latest web technologies, featuring a strict development environment to ensure code quality and consistency.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Package Manager:** [Yarn](https://yarnpkg.com/) (Strictly Enforced)

## 🛠️ Development Tools & enforce Quality

We rely on strict tooling to maintain high code standards:

- **Linter:** [ESLint](https://eslint.org/) (with strict TypeScript and Next.js rules)
- **Formatter:** [Prettier](https://prettier.io/)
- **Git Hooks:** [Husky](https://typicode.github.io/husky/)
- **Staged Linter:** [lint-staged](https://github.com/lint-staged/lint-staged)

> **Note:** `npm` is explicitly blocked in this project to prevent lockfile conflicts. You must use `yarn`.

## 🏁 Getting Started

### 1. Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [Yarn](https://yarnpkg.com/)

### 2. Installation

Install dependencies using Yarn:

```bash
yarn install
```

_Note: If you try to run `npm install`, it will fail automatically._

### 3. Running the Development Server

Start the local development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

To create a production build:

```bash
yarn build
```

To start the production server:

```bash
yarn start
```

## 🧹 Linting & Formatting

You can manually run the following commands to check and fix code issues:

| Command         | Description                      |
| :-------------- | :------------------------------- |
| `yarn lint`     | Check for linting errors         |
| `yarn lint:fix` | Fix linting errors automatically |
| `yarn format`   | Format all files using Prettier  |

## 🔗 Git Hooks

This project uses **Husky** to automatically verify code quality before committing.

- **Pre-commit Hook:** Runs `lint-staged` to ensure that all staged files are properly formatted and linted before they can be committed.
  - If there are errors, the commit will be blocked until they are resolved.
  - This ensures that broken or messy code never reaches the repository.

## 📂 Project Structure

```bash
.
├── app/                  # Next.js App Router pages and layouts
├── public/               # Static assets
├── .husky/               # Git hooks configuration
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
├── postcss.config.mjs    # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
└── yarn.lock             # Yarn lockfile (Source of Truth)
```
