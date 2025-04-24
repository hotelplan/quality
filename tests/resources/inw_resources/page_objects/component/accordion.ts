import { type Page, type Locator, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class AccordionComponent {
    readonly page: Page
    readonly accordionTitleFld: Locator
    readonly accordionTitle: string
    readonly addAccordionItemBtn: Locator
    readonly addContentBtn: Locator
    readonly createAccordionBtn: Locator

    constructor(page: Page) {
        this.page = page;
        this.accordionTitleFld = page.locator('#title')
        this.accordionTitle = `${faker.word.adjective()} ${faker.word.noun()} Accordion Title ${faker.number.int({ min: 50, max: 1000 })}`
        this.addAccordionItemBtn = page.getByRole('button', { name: 'Add Accordion Item' })
        this.addContentBtn = page.getByRole('button', { name: 'Add content' }).nth(1)
        this.createAccordionBtn = page.locator('.btn-primary').last()

    }

    async clickAddAccordionItemBtn(){
        await this.addAccordionItemBtn.waitFor({ state: 'visible' })
        await this.addAccordionItemBtn.click()
    }

    async inputAccordionTitle(){
        await this.accordionTitleFld.waitFor({ state: 'visible' })
        await this.accordionTitleFld.fill(this.accordionTitle)
    }

    async clickAddContentBtn() {
        await this.addContentBtn.click()

    }

    async clickCreateAccordionItemBtn(){
        await this.createAccordionBtn.click()
    }
}

export default AccordionComponent