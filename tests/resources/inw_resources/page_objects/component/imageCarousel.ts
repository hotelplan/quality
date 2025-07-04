import test, { type Page, type Locator, expect, FrameLocator } from '@playwright/test';
import path from 'path';

export class ImageCarouselComponent {
    readonly page: Page
    readonly titleField: Locator
    readonly AddImageCarouselItemBtn: Locator
    readonly selectImageOrVideoBtn: Locator
    readonly mediaImage: (imgName: string) => Locator  
    readonly uploadBtn: Locator
    readonly selectImageBtn: Locator
    readonly createBtn: Locator
    readonly mainSiteContent: (context : any) => Locator
    readonly carousel: (context : any) => Locator
    readonly carouselItem: (context : any) => Locator
    public uploadedImageCount: any

    constructor(page: Page) {
        this.page = page;
        this.titleField = page.getByRole('textbox', { name: 'Property alias:' });
        this.AddImageCarouselItemBtn = page.getByRole('button', { name: 'Add Image Carousel Item' });
        this.selectImageOrVideoBtn = page.getByRole('link', { name: 'Select Image Or Video' });
        this.mediaImage = (imgName: string) => page.getByRole('button', { name: imgName, exact: true });
        this.uploadBtn = page.locator('input[type="file"]');
        this.selectImageBtn = page.getByRole('button', { name: 'Select' });
        this.createBtn = page.getByRole('button', { name: 'Create', exact: true }).nth(1);

        this.mainSiteContent = (context : any) => context.locator('body');
        this.carousel = (context : any) => context.locator('[role="group"]');
        this.carouselItem = (context : any) => context.locator('[class="fig-image"]');
    }

    async setupImageCarousel() {
        
        const imageNames = ["Testimage1", "Testimage2", "Testimage3"];
        
        await this.titleField.waitFor({ state: 'visible' });
        await this.titleField.fill('IMAGE CAROUSEL TEST');

        for (const images of imageNames) {

            var imageVis: boolean = false;

            await this.AddImageCarouselItemBtn.click();
            await this.selectImageOrVideoBtn.click();
            await this.page.waitForLoadState('networkidle');
            console.log(`Image name: ${images}`);
            try{
                imageVis = await this.mediaImage(images).isEnabled({ timeout: 3000 });
            }
            catch (error) {
                console.log(`Image not found: ${images}`);
                imageVis = false;
            }
            
            console.log(`Image visibility: ${imageVis}`);

            if (imageVis === true) {
                await this.mediaImage(images).click();
                await this.selectImageBtn.click();
            }
            else{
                const testpath = path.join(__dirname, '../data', `${images}.jpg`);
                //await this.uploadBtn.waitFor({ state: 'visible' });
                await this.uploadBtn.setInputFiles(testpath);
                await this.page.waitForLoadState('networkidle');
                await this.mediaImage(images).waitFor({ state: 'attached' });
                await this.mediaImage(images).click();
                await this.page.waitForTimeout(500)
                await this.mediaImage(images).click();
                await this.selectImageBtn.click();
            }
            await this.createBtn.waitFor({ state: 'visible' });
            await this.createBtn.click();
            await this.page.waitForLoadState('networkidle');
        }

        this.uploadedImageCount = imageNames.length
    }

    async validateImageCarousel(newPage) {
        await expect(this.mainSiteContent(newPage), "Image Carousel Title is available on the page").toContainText('IMAGE CAROUSEL TEST');
        await expect(this.carousel(newPage), "Image Carousel is available on the page").toHaveCount(this.uploadedImageCount);
        await expect(this.carouselItem(newPage), "Image Carousel Item is available on the page").toHaveCount(this.uploadedImageCount);
    }

}

export default ImageCarouselComponent