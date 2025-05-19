import { type Page, type Locator, expect, FrameLocator } from '@playwright/test';
import { faker } from '@faker-js/faker';
export class RTEComponent {
    readonly page: Page
    readonly rteFrame: FrameLocator
    readonly rteParagraph: Locator
    readonly mainSiteContent: (context: any) => Locator

    public randomText: string = faker.lorem.sentence()


    constructor(page: Page) {
        this.page = page;
        this.rteFrame = page.frameLocator('[title="Rich Text Area"]');
        this.rteParagraph = this.rteFrame.locator('[id ="tinymce"]');
        this.mainSiteContent = (context : any) => context.locator('body');
    }
    async fillOutRTETextEditor() {
        await expect(this.rteParagraph).toBeVisible()
        await this.rteParagraph.fill(this.randomText);
    }

    async validateRTE(newPage) {
        await expect(this.mainSiteContent(newPage), "RTE text is available on the page").toContainText(this.randomText);
    }

}

export default RTEComponent