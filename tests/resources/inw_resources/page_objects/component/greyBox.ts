import test, { type Page, type Locator, expect, FrameLocator } from '@playwright/test';
import path from 'path';

export class GreyBoxComponent {
    readonly page: Page
    readonly themeDropdown: Locator


    readonly greyBox: (context : any, theme : string) => Locator


    constructor(page: Page) {
        this.page = page;
        this.themeDropdown = page.getByRole('combobox');


        this.greyBox = (context : any, theme : string) => context.locator(`//div[contains(@class,"highlighted-section--${theme}")]`);

    }

    async setupGreyBox() {
        const options = ['Grey', 'Primary', 'Secondary'];
        const randomOption = options[Math.floor(Math.random() * options.length)];

        await this.themeDropdown.waitFor({ state: 'visible' });
        await this.themeDropdown.selectOption({ label: randomOption });

        console.log(`Selected theme: ${randomOption}`);
        return randomOption;
    }

    async validateGreyBox(newPage, theme: string) {
        const themeSelected = theme.toLowerCase();
        await expect(this.greyBox(newPage, themeSelected)).toBeVisible();
        
        await newPage.close();
    }

}

export default GreyBoxComponent