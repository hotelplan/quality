import { type Page, type Locator, expect, FrameLocator } from '@playwright/test';
import { faker } from '@faker-js/faker';
export class RTEComponent {
    readonly page: Page
    readonly mainSiteContent: (context: any) => Locator

    public randomText: string = faker.lorem.sentence()


    constructor(page: Page) {
        this.page = page;
        this.mainSiteContent = (context : any) => context.locator('body');
    }

    async validateRTE(newPage) {
        await expect(this.mainSiteContent(newPage), "RTE text is available on the page").toContainText(this.randomText);
    }

}

export default RTEComponent