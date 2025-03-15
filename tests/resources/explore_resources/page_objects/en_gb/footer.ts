import { type Page, type Locator, expect } from '@playwright/test';
import { link } from 'node:fs/promises';

export class Footerpage {
    //variables
    readonly page: Page;
    readonly footer_link: (primary_link: string) => Locator;

    //locators
    constructor(page: Page) {
        this.page = page;
        this.footer_link = (primary_link: string) => page.locator(`a[text()="${primary_link}"]`);
    }

    //methods
    async footerLink(primary_link: string, url: string){
        await this.footer_link(primary_link).waitFor({ state: 'visible', timeout: 15000 });
        await this.footer_link(primary_link).hover();
        await this.footer_link(primary_link).click();
    }
}
export default Footerpage;