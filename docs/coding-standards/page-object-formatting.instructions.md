# Page Object Formatting Instructions

## Overview
This document defines the standard formatting and structure for Page Object Model (POM) classes in this project to ensure consistency, readability, and maintainability.

## File Structure

### 1. Imports
- Place all imports at the top of the file
- Import Playwright types first: `Page`, `Locator`, `expect`
- Group related imports together
- Use `type` keyword for TypeScript type imports

```typescript
import { type Page, type Locator, expect } from '@playwright/test';
```

### 2. Class Structure
Page Object classes must follow this exact order:

#### A. Variables Section
- Start with comment: `// Variables`
- Declare `readonly page: Page` first
- List all Locator variables as readonly
- Use descriptive PascalCase names for locators
- Group related locators together

```typescript
export class HomePage {
    // Variables
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly howItWorksTitle: Locator;
```

#### B. Constructor Section
- Initialize page parameter first
- Initialize all locators with their selectors
- Use clear, specific selectors
- Add comments for complex selectors if needed
- Prefer CSS selectors over XPath when possible

```typescript
    constructor(page: Page) {
        this.page = page;
        this.username = page.locator('#username');
        this.password = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]');
        this.howItWorksTitle = page.locator('h1:has-text("How It Works")');
    }
```

#### C. Methods Section
- Start with comment: `// Methods`
- Use descriptive method names in camelCase
- Include return type annotations
- Add JSDoc comments for complex methods
- Group related methods together
- Public methods first, private methods last

```typescript
    // Methods
    async login(username: string, password: string): Promise<void> {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    async isLoggedIn(): Promise<boolean> {
        return await this.logoutButton.isVisible();
    }
```

## Naming Conventions

### Variables
- Use descriptive names that clearly indicate the element's purpose
- Use camelCase for variable names
- Avoid abbreviations unless they're widely understood
- Examples: `loginButton`, `searchField`, `userProfile`, `navigationMenu`

### Methods
- Use verb-based names that describe the action
- Use camelCase for method names
- Prefix with `get` for methods that return values
- Prefix with `is` or `has` for boolean methods
- Examples: `clickLogin()`, `fillSearchField()`, `isVisible()`, `getUserName()`

## Selector Guidelines

### Prefer in this order:
1. `data-testid` attributes
2. `id` attributes  
3. Semantic selectors (role, aria-label)
4. CSS classes (stable ones)
5. Text content (for buttons, links)
6. CSS selectors by tag/attribute

### Examples:
```typescript
// Good - using data-testid
this.submitButton = page.locator('[data-testid="submit-button"]');

// Good - using id
this.emailField = page.locator('#email');

// Good - using role
this.navigation = page.locator('nav[role="navigation"]');

// Good - using stable class
this.errorMessage = page.locator('.error-message');

// Good - using text content
this.loginLink = page.locator('a:has-text("Login")');
```

## Best Practices

### 1. Locator Initialization
- Initialize all locators in the constructor
- Avoid getter methods for simple locators
- Use `.first()` when multiple elements might match
- Use `.filter()` for complex matching

### 2. Method Design
- Keep methods focused on a single action
- Return appropriate types (Promise<void>, Promise<boolean>, etc.)
- Use async/await for all Playwright operations
- Include error handling where appropriate

### 3. Documentation
- Add JSDoc comments for complex methods
- Include parameter descriptions
- Document return values
- Add examples for non-obvious usage

```typescript
/**
 * Performs login with provided credentials
 * @param username - User's email or username
 * @param password - User's password
 * @throws {Error} When login fails
 */
async login(username: string, password: string): Promise<void> {
    // Implementation
}
```

### 4. File Organization
- One page object per file
- File name should match class name in kebab-case
- Place in appropriate directory structure
- Export the class as default if it's the main export

## Example Template

```typescript
import { type Page, type Locator, expect } from '@playwright/test';

export class PageObjectName {
    // Variables
    readonly page: Page;
    readonly elementOne: Locator;
    readonly elementTwo: Locator;
    readonly elementThree: Locator;

    constructor(page: Page) {
        this.page = page;
        this.elementOne = page.locator('selector1');
        this.elementTwo = page.locator('selector2');
        this.elementThree = page.locator('selector3');
    }

    // Methods
    async performAction(): Promise<void> {
        // Implementation
    }

    async checkCondition(): Promise<boolean> {
        // Implementation
    }

    async getValue(): Promise<string> {
        // Implementation
    }
}

export default PageObjectName;
```

## Enforcement
- All new page objects must follow this format
- Existing page objects should be refactored when modified
- Code reviews should check adherence to these standards
- Use linting rules where possible to enforce consistency
