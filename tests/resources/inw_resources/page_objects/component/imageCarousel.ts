import test, { type Page, type Locator, expect, FrameLocator } from '@playwright/test';
import path from 'path';

export class ImageCarouselComponent {
    readonly page: Page
    readonly titleField: Locator

    readonly mainSiteContent: (context : any) => Locator

    constructor(page: Page) {
        this.page = page;
        this.titleField = page.getByRole('textbox', { name: 'Property alias:' });




        this.mainSiteContent = (context : any) => context.locator('body');
    }

    async setupImageCarousel() {
        const testImage1 = path.join(__dirname, '..', 'data', 'testImage1.jpg');
        const testImage2 = path.join(__dirname, '..', 'data', 'testImage2.jpg');
        const testImage3 = path.join(__dirname, '..', 'data', 'testImage3.jpg');
        const imagePaths = [testImage1, testImage2, testImage3];

        console.log("Test image path:", testImage1);

    }

    async validateImageCarousel(newPage) {
       
    }

}

export default ImageCarouselComponent