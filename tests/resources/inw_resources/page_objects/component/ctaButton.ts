import { type Page, type Locator, expect } from '@playwright/test';
import environmentBaseUrl from '../../../../resources/utils/environmentBaseUrl';
import { faker } from '@faker-js/faker';
export class CTAButtonComponent {
    readonly page: Page
    readonly themeDropdown: Locator
    readonly positionHorizontalDropdown: Locator
    public ctaBtnTheme: string[]
    public ctaBtnHorizontalposition: string[]

    constructor(page: Page) {
        this.page = page;
        this.themeDropdown = page.locator('#theme')
        this.positionHorizontalDropdown = page.locator('#positionHorizontal')
    }

    async selectCTAButtonTheme() {
        const themeRandomIndex = Math.floor(Math.random() * 3);
        await this.themeDropdown.waitFor({ state: 'visible' })
        await this.themeDropdown.click()
        this.ctaBtnTheme = await this.themeDropdown.selectOption({ index: themeRandomIndex })
    }

    async selectCTAButtonPosition() {
        const positionHorizontalRandomIndex = Math.floor(Math.random() * 4);

        await this.positionHorizontalDropdown.waitFor({ state: 'visible' })
        await this.positionHorizontalDropdown.click()
        this.ctaBtnHorizontalposition = await this.positionHorizontalDropdown.selectOption({ index: positionHorizontalRandomIndex })
    }

    async validateCtaButtonAvailability(newPage, ctaButtonProperty) {
        // Wait for page to fully load
        await newPage.waitForLoadState('domcontentloaded')
        
        // Validate required properties are set
        if (!ctaButtonProperty.title || !ctaButtonProperty.icon) {
            throw new Error('CTA Button properties are not properly set')
        }
        
        const expectedCTABtnTheme = this.ctaBtnTheme[0].split(':')[1]
        
        await expect(newPage.locator('body'), "CTA Button title text is available on the page").toContainText(ctaButtonProperty.title);
        await expect(newPage.locator(`a[title="${ctaButtonProperty.title}"]`), "CTA Button title is available on the page").toBeVisible()
        await expect(newPage.locator(`a[title="${ctaButtonProperty.title}"]`), "CTA Button link is correct").toHaveAttribute('href', environmentBaseUrl.googleLink.testLink)
        await expect(newPage.locator(`a[title="${ctaButtonProperty.title}"] [aria-labelledby='${ctaButtonProperty.icon}']`), "CTA Button icon is correct").toBeVisible()
        
        const actualCTABtnClassName = await newPage.locator(`a[title="${ctaButtonProperty.title}"]`).evaluate(node => node.className)
        expect(actualCTABtnClassName.includes(expectedCTABtnTheme), "CTA button theme is correct").toBeTruthy()

        // Position validation with better error handling
        const buttonLocator = newPage.locator(`a[title="${ctaButtonProperty.title}"]`)
        await buttonLocator.waitFor({ state: 'visible' })
        
        if (expectedCTABtnTheme == 'right') {
            const justifyContent = await buttonLocator.evaluate(node => window.getComputedStyle(node.parentElement!).justifyContent)
            expect(justifyContent, "CTA button is correctly positioned on the right").toBe('end')

        } else if (expectedCTABtnTheme == 'center') {
            const justifyContent = await buttonLocator.evaluate(node => window.getComputedStyle(node.parentElement!).justifyContent)
            expect(justifyContent, "CTA button is correctly positioned on the center").toBe('center')

        } else if (expectedCTABtnTheme == 'left') {
            const justifyContent = await buttonLocator.evaluate(node => window.getComputedStyle(node.parentElement!).justifyContent)
            expect(justifyContent, "CTA button is correctly positioned on the left").toBe('start')

        } else if (expectedCTABtnTheme == 'full') {
            const display = await buttonLocator.evaluate(node => window.getComputedStyle(node.parentElement!).display)
            expect(display, "CTA button is correctly set to full width").toBe('block')
        }
    }

}

export default CTAButtonComponent