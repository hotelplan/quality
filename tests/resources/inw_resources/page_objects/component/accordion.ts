import { type Page, type Locator, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class AccordionComponent {
    readonly page: Page
    readonly accordionTitleFld: Locator
    readonly accordionTitle: string
    readonly addAccordionItemBtn: Locator
    readonly addContentBtn: Locator
    readonly createAccordionIEntryBtn: Locator

    constructor(page: Page) {
        this.page = page;
        this.accordionTitleFld = page.locator('#title')
        this.accordionTitle = `${faker.word.adjective()} ${faker.word.noun()} Accordion Title ${faker.number.int({ min: 50, max: 1000 })}`
        this.addAccordionItemBtn = page.getByRole('button', { name: 'Add Accordion Item' })
        this.addContentBtn = page.getByRole('button', { name: 'Add content' }).nth(1)
        this.createAccordionIEntryBtn = page.locator('.btn-primary').last()

    }

    async clickAddAccordionItemBtn(){
        await this.addAccordionItemBtn.waitFor({ state: 'visible' })
        await this.addAccordionItemBtn.click()
    }

    async inputAccordionTitle(){
        const uniqueAccordionTitle = `${faker.word.adjective()} ${faker.word.noun()} Accordion Title ${faker.number.int({ min: 50, max: 1000 })}`
        await this.accordionTitleFld.waitFor({ state: 'visible' })
        await this.accordionTitleFld.fill(uniqueAccordionTitle)
        
        return uniqueAccordionTitle
    }

    async clickAddContentBtn() {
        await this.addContentBtn.click()

    }

    async clickCreateAccordionEntryBtn(){
        await this.createAccordionIEntryBtn.click()
    }

    async clickCreateAccordionItemBtn(){
        const createAccordionItemBtn = this.page.locator('.btn-primary').nth(1)
        await createAccordionItemBtn.click()
    }

    async validateAccordionAvailability(){

    }
}

export default AccordionComponent