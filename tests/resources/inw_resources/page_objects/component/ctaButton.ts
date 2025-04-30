import { type Page, type Locator, expect } from '@playwright/test';

export class CTAButtonComponent {
    readonly page: Page
    readonly themeDropdown: Locator
    readonly positionHorizontalDropdown: Locator
    public theme: string

    constructor(page: Page) {
        this.page = page;
        this.themeDropdown = page.locator('#theme')
        this.positionHorizontalDropdown = page.locator('#positionHorizontal')

    }
    async setupCtaButton() {
        const themeRandomIndex = Math.floor(Math.random() * 3);
        const positionHorizontalRandomIndex = Math.floor(Math.random() * 4);

        await this.themeDropdown.click()
        await this.themeDropdown.selectOption({ index: themeRandomIndex })
        await this.positionHorizontalDropdown.click()
        await this.positionHorizontalDropdown.selectOption({ index: positionHorizontalRandomIndex })

    }

}

export default CTAButtonComponent