import { type Page, type Locator, expect } from '@playwright/test';
import environmentBaseUrl from '../../../../resources/utils/environmentBaseUrl';
import { faker } from '@faker-js/faker';
export class CTAButtonComponent {
    readonly page: Page
    readonly themeDropdown: Locator
    readonly positionHorizontalDropdown: Locator
    readonly iconPickerBtn: Locator
    readonly iconPickerItem: Locator
    readonly createCTAButtonBtn: Locator
    public theme: string
    public iconName: string | null
    public ctaBtnTheme: string[]
    public ctaBtnHorizontalposition: string[]

    constructor(page: Page) {
        this.page = page;
        this.themeDropdown = page.locator('#theme')
        this.positionHorizontalDropdown = page.locator('#positionHorizontal')
        this.iconPickerBtn = page.locator('[data-element="sortable-thumbnails"]')
        this.iconPickerItem = page.locator('.umb-iconpicker-item')
        this.createCTAButtonBtn = page.locator('.btn-primary')

    }

    async selectCTAButtonTheme() {
        const themeRandomIndex = Math.floor(Math.random() * 3);
        await this.themeDropdown.click()
        this.ctaBtnTheme = await this.themeDropdown.selectOption({ index: themeRandomIndex })
    }

    async selectCTAButtonPosition() {
        const positionHorizontalRandomIndex = Math.floor(Math.random() * 4);

        await this.positionHorizontalDropdown.click()
        this.ctaBtnHorizontalposition = await this.positionHorizontalDropdown.selectOption({ index: positionHorizontalRandomIndex })
    }

    async selectCtaButtonIcon() {
        await this.iconPickerBtn.click()
        await expect(this.iconPickerItem.nth(0)).toBeVisible()

        const iconPickerItemCount = await this.iconPickerItem.count()
        const iconItemIndex = Math.floor(Math.random() * iconPickerItemCount)
        this.iconName = await this.iconPickerItem.nth(iconItemIndex).locator('a').getAttribute('title')
        await this.iconPickerItem.nth(iconItemIndex).click()

    }

    async validateCtaButtonAvailability(newPage, ctaButtonTitle) {
        const expectedCTABtnTheme = this.ctaBtnTheme[0].split(':')[1]
        await expect(newPage.locator('body'), "CTA Button title text is available on the page").toContainText(ctaButtonTitle);
        await expect(newPage.locator(`a[title="${ctaButtonTitle}"]`), "CTA Button title is available on the page").toBeVisible()
        await expect(newPage.locator(`a[title="${ctaButtonTitle}"]`), "CTA Button link is correct").toHaveAttribute('href', environmentBaseUrl.googleLink.testLink)
        await expect(newPage.locator(`a[title="${ctaButtonTitle}"] [aria-labelledby='${this.iconName}']`), "CTA Button icon is correct").toBeVisible()
        const actualCTABtnClassName = await newPage.locator(`a[title="${ctaButtonTitle}"]`).evaluate(node => node.className)
        expect(actualCTABtnClassName.includes(expectedCTABtnTheme), "CTA button theme is correct").toBeTruthy()

        if (expectedCTABtnTheme == 'right') {
            expect(await newPage.locator(`a[title="${ctaButtonTitle}"]`).evaluate(node => window.getComputedStyle(node.parentElement!).justifyContent), "CTA button is correctly positioned on the right").toBe('end')

        } else if (expectedCTABtnTheme == 'center') {
            expect(await newPage.locator(`a[title="${ctaButtonTitle}"]`).evaluate(node => window.getComputedStyle(node.parentElement!).justifyContent), "CTA button is correctly positioned on the center").toBe('center')

        } else if (expectedCTABtnTheme == 'left') {
            expect(await newPage.locator(`a[title="${ctaButtonTitle}"]`).evaluate(node => window.getComputedStyle(node.parentElement!).justifyContent), "CTA button is correctly positioned on the left").toBe('start')

        } else if (expectedCTABtnTheme == 'full') {
            expect(await newPage.locator(`a[title="${ctaButtonTitle}"]`).evaluate(node => window.getComputedStyle(node.parentElement!).display), "CTA button is correctly set to full width").toBe('block')

        }

    }

}

export default CTAButtonComponent