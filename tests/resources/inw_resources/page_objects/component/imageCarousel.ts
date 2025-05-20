import test, { type Page, type Locator, expect, FrameLocator } from '@playwright/test';
import path from 'path';

export class ImageCarouselComponent {
    readonly page: Page
    readonly titleField: Locator
    readonly AddImageCarouselItemBtn: Locator
    readonly selectImageOrVideoBtn: Locator
    readonly mediaImage: (name: string) => Locator  
    readonly uploadBtn: Locator
    readonly selectImageBtn: Locator
    readonly createBtn: Locator
    readonly mainSiteContent: (context : any) => Locator

    constructor(page: Page) {
        this.page = page;
        this.titleField = page.getByRole('textbox', { name: 'Property alias:' });
        this.AddImageCarouselItemBtn = page.getByRole('button', { name: 'Add Image Carousel Item' });
        this.selectImageOrVideoBtn = page.getByRole('link', { name: 'Select Image Or Video' });
        this.mediaImage = (name: string) => page.locator(`//div[contains(text(),"${name}")]`);
        this.uploadBtn = page.getByRole('button', { name: 'Upload' });
        this.selectImageBtn = page.getByRole('button', { name: 'Select' });
        this.createBtn = page.getByRole('button', { name: 'Create', exact: true }).nth(1);



        this.mainSiteContent = (context : any) => context.locator('body');
    }

    async setupImageCarousel() {
        
        const imageNames = ["testImage1", "testImage2", "testImage3"];
        
        await this.titleField.waitFor({ state: 'visible' });
        await this.titleField.fill('IMAGE CAROUSEL TEST');

        for (const images of imageNames) {

            await this.AddImageCarouselItemBtn.click();
            await this.selectImageOrVideoBtn.click();

            const imageVis = await this.mediaImage(images).isVisible();

            if (imageVis === true) {
                await this.mediaImage(images).click();
                await this.selectImageBtn.click();
            }
            else{
                const testpath = path.join(__dirname, '..', 'data', `${images}.jpg`);
                await this.uploadBtn.click();
                await this.uploadBtn.setInputFiles(testpath);
                await this.mediaImage(images).waitFor({ state: 'visible' });
                await this.mediaImage(images).click();
                await this.selectImageBtn.click();
            }
            await this.createBtn.waitFor({ state: 'visible' });
            await this.createBtn.click();
        }
    }

    async validateImageCarousel(newPage) {
       
    }

}

export default ImageCarouselComponent