import test, { type Page, type Locator, expect, FrameLocator } from '@playwright/test';
import path from 'path';

export class GreyBoxComponent {
    readonly page: Page
    readonly titleField: Locator


    readonly mainSiteContent: (context : any) => Locator


    constructor(page: Page) {
        this.page = page;


        this.mainSiteContent = (context : any) => context.locator('body');

    }

    async setupGreyBox() {
        
        
        await this.titleField.waitFor({ state: 'visible' });


    }

    async validateGreyBox(newPage) {
        await expect(this.mainSiteContent(newPage), "Grey Box Title is available on the page").toContainText('Grey Box TEST');
    }

}

export default GreyBoxComponent