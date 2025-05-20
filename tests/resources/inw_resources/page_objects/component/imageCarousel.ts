import { type Page, type Locator, expect, FrameLocator } from '@playwright/test';

export class ImageCarouselComponent {
    readonly page: Page
    readonly rteFrame: FrameLocator
    readonly rteParagraph: Locator
    readonly mainSiteContent: (context : any) => Locator

    readonly randomText: string = 'Automation SKI Components - Image Carousel Component'

    constructor(page: Page) {
        this.page = page;
        this.rteFrame = page.frameLocator('[title="Rich Text Area"]');
        this.rteParagraph = this.rteFrame.locator('[id ="tinymce"]');
        this.mainSiteContent = (context : any) => context.locator('body');
    }
    async setupRTE() {
        console.log("Random:", this.randomText)
        await expect(this.rteParagraph).toBeVisible({timeout: 10000})
        await this.rteParagraph.fill(this.randomText);
    }

    async validateRTE(newPage) {
        await expect(this.mainSiteContent(newPage), "RTE text is available on the page").toContainText(this.randomText, {timeout: 30000});
    }

}

export default ImageCarouselComponent