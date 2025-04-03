import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;

// Helper function to read URLs from the CSV file
const LaplandDatacsv = parse(fs.readFileSync(path.join(__dirname, '..', 'migration_data', 'Migration_Lapland.csv')), {columns: true, skip_empty_lines: true});
const SantaDatacsv = parse(fs.readFileSync(path.join(__dirname, '..', 'migration_data', 'Migration_SantasBreaks.csv')), {columns: true, skip_empty_lines: true});
const SkiDatacsv = parse(fs.readFileSync(path.join(__dirname, '..', 'migration_data', 'Migration_Ski.csv')), {columns: true, skip_empty_lines: true});
const WalkingDatacsv = parse(fs.readFileSync(path.join(__dirname, '..', 'migration_data', 'Migration_Walking.csv')), {columns: true, skip_empty_lines: true});

test.beforeEach(async ({ page }) => {
    await test.step('Given: I navigate to home page', async () => {
        await page.goto(ECMSurl + '/');
    });
});

test.describe('Lapland Region Broad Search', async () => {

    const laplandRegionData = LaplandDatacsv.filter(row => row['Alias'].includes('region'));

    for (const Data of laplandRegionData) {
        test(`Broad search proceeds with default values for ${Data.Region} holidays @inw`, async ({ searchResultPage}) => {
            test.setTimeout(120000);
            await test.step(`Given: I sleect a product to search`, async () => {
                await searchResultPage.clickSearchProductTab('Lapland');
            });

            await test.step(`And: I input search location`, async () => {
                await searchResultPage.searchAnywhere(Data.Region);
            });
            
            await test.step(`And: I search for holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn();
            });

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl();
            });

            await test.step('And: I check the Search results criteria', async () => {
                await searchResultPage.checkCriteriaBarContent('Any date (7 nights)');
                await searchResultPage.checkCriteriaBarContent('2 adults');
                await searchResultPage.checkCriteriaBarContent('From Any departure location');
            });

            await test.step('When : I check Accomodation cards search results', async () => {
                await searchResultPage.countAccommodationCards();
            });
        });
    }
});

test.describe('Santa Region Broad Search', async () => {

    const santaRegionData = SantaDatacsv.filter(row => row['Alias'].includes('region'));

    for (const Data of santaRegionData) {
        test(`Broad search proceeds with default values for ${Data.Region} holidays @inw`, async ({ searchResultPage}) => {
            test.setTimeout(120000);
            await test.step(`Given: I sleect a product to search`, async () => {
                await searchResultPage.clickSearchProductTab('Lapland');
            });

            await test.step(`And: I input search location`, async () => {
                await searchResultPage.searchAnywhere(Data.Region);
            });
            
            await test.step(`And: I search for holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn();
            });

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl();
            });

            await test.step('And: I check the Search results criteria', async () => {
                await searchResultPage.checkCriteriaBarContent('Any date (7 nights)');
                await searchResultPage.checkCriteriaBarContent('2 adults');
                await searchResultPage.checkCriteriaBarContent('From Any departure location');
            });

            await test.step('When : I check Accomodation cards search results', async () => {
                await searchResultPage.countAccommodationCards();
            });
        });
    }
});

test.describe('Ski Region Broad Search', async () => {

    const skiRegionData = SkiDatacsv.filter(row => row['Alias'].includes('region'));

    for (const Data of skiRegionData) {
        test(`Broad search proceeds with default values for ${Data.SourcePath} holidays @inw`, async ({ searchResultPage}) => {
            test.setTimeout(120000);
            await test.step(`Given: I sleect a product to search`, async () => {
                await searchResultPage.clickSearchProductTab('Ski');
            });

            await test.step(`And: I input search location`, async () => {
                await searchResultPage.searchAnywhere(Data.Region);
            });
            
            await test.step(`And: I search for holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn();
            });

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl();
            });

            await test.step('And: I check the Search results criteria', async () => {
                await searchResultPage.checkCriteriaBarContent('Any date (7 nights)');
                await searchResultPage.checkCriteriaBarContent('2 adults');
                await searchResultPage.checkCriteriaBarContent('From Any departure location');
            });

            await test.step('When : I check Accomodation cards search results', async () => {
                await searchResultPage.countAccommodationCards();
            });
        });
    }
});

test.describe('Walking Region Broad Search', async () => {

    const walkingRegionData = WalkingDatacsv.filter(row => row['Alias'].includes('region'));

    for (const Data of walkingRegionData) {
        test(`Broad search proceeds with default values for ${Data.Region} holidays @inw`, async ({ searchResultPage}) => {
            test.setTimeout(120000);
            await test.step(`Given: I sleect a product to search`, async () => {
                await searchResultPage.clickSearchProductTab('Walking');
            });

            await test.step(`And: I input search location`, async () => {
                await searchResultPage.searchAnywhere(Data.Region);
            });
            
            await test.step(`And: I search for holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn();
            });

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl();
            });

            await test.step('And: I check the Search results criteria', async () => {
                await searchResultPage.checkCriteriaBarContent('Any date (7 nights)');
                await searchResultPage.checkCriteriaBarContent('2 adults');
                await searchResultPage.checkCriteriaBarContent('From Any departure location');
            });

            await test.step('When : I check Accomodation cards search results', async () => {
                await searchResultPage.countAccommodationCards();
            });
        });
    }
});

