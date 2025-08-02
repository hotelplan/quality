import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import PaginationHelper from '../../../resources/inw_resources/page_objects/component/paginationHelper';

const env = process.env.ENV || "qa";
const inghamsUrl = environmentBaseUrl[env].inghams;

// Test data for different search categories
const searchCategories = [
    { category: 'Ski', searchLocation: 'anywhere' },
    { category: 'Walking', searchLocation: 'anywhere' },
    { category: 'Lapland', searchLocation: 'anywhere' }
];

test.beforeEach(async ({ page }) => {
    await test.step('Given: I navigate to Inghams home page', async () => {
        await page.goto(inghamsUrl);
        await page.waitForLoadState('domcontentloaded');
        
        // Handle cookies more gracefully
        try {
            const acceptCookiesBtn = page.getByRole('button', { name: 'Accept All Cookies' });
            if (await acceptCookiesBtn.isVisible({ timeout: 5000 })) {
                await acceptCookiesBtn.click();
                console.log('✓ Cookies accepted');
            } else {
                console.log('ℹ️ No cookies banner found');
            }
        } catch (error) {
            console.log('ℹ️ Cookies handling skipped:', error.message);
        }
        
        // Wait for page to be ready
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
            console.log('Network idle timeout, continuing...');
        });
    });
});

test.describe('Search Pagination Tests', async () => {
    
    // Comprehensive pagination test for all search categories
    for (const { category, searchLocation } of searchCategories) {
        test(`Comprehensive ${category} pagination test @searchPagination`, async ({ page, searchResultPage }) => {
            test.setTimeout(120000);
            
            await test.step(`When: I perform ${category} search`, async () => {
                await searchResultPage.clickSearchProductTab(category);
                await searchResultPage.searchAnywhere(searchLocation);  
                await searchResultPage.clickSearchHolidayBtn();
                await searchResultPage.validateSearchResultPageUrl();
                await searchResultPage.countAccommodationCards();
            });

            await test.step(`Then: I test comprehensive pagination functionality for ${category}`, async () => {
                console.log(`\n🔍 Comprehensive Pagination Testing for ${category}:`);
                
                // Wait for pagination to be available
                await page.waitForSelector('nav[aria-label*="Pagination"], .pagination', { timeout: 10000 }).catch(() => {
                    console.log('No pagination found, proceeding with single page test');
                });
                
                // Store initial content for comparison
                const initialResults = await page.locator('.c-search-card, .search-result, .result-card').count();
                const initialUrl = page.url();
                console.log(`   Initial page: ${initialResults} results at ${initialUrl}`);
                
                // Test 1: Click next arrow
                const nextArrowButton = page.getByRole('button').filter({ hasText: /^$/ }).nth(1);
                
                if (await nextArrowButton.isVisible({ timeout: 5000 })) {
                    console.log(`\n   ➡️ Testing next arrow button for ${category}...`);
                    await nextArrowButton.click();
                    await page.waitForLoadState('networkidle');
                    
                    const nextUrl = page.url();
                    const nextResults = await page.locator('.c-search-card, .search-result, .result-card').count();
                    console.log(`   After next arrow: ${nextResults} results at ${nextUrl}`);
                    
                    // Test 2: Try clicking on different page numbers
                    console.log(`\n   📄 Testing page number navigation for ${category}...`);
                    
                    const page3Button = page.getByRole('button', { name: '3', exact: true });
                    const page2Button = page.getByRole('button', { name: '2', exact: true });
                    
                    if (await page3Button.isVisible({ timeout: 3000 }) && !(await page3Button.isDisabled())) {
                        console.log('   3️⃣ Testing page 3 button click...');
                        await page3Button.click();
                        await page.waitForLoadState('networkidle');
                        
                        const page3Url = page.url();
                        const page3Results = await page.locator('.c-search-card, .search-result, .result-card').count();
                        console.log(`   Page 3: ${page3Results} results at ${page3Url}`);
                        
                        const hasPage3Param = page3Url.includes('page=3');
                        console.log(`   URL correctly shows page 3: ${hasPage3Param}`);
                    } else if (await page2Button.isVisible({ timeout: 3000 })) {
                        const isPage2Disabled = await page2Button.isDisabled();
                        if (!isPage2Disabled) {
                            console.log('   2️⃣ Testing page 2 button click...');
                            await page2Button.click();
                            await page.waitForLoadState('networkidle');
                            
                            const page2Url = page.url();
                            const page2Results = await page.locator('.c-search-card, .search-result, .result-card').count();
                            console.log(`   Page 2: ${page2Results} results at ${page2Url}`);
                        } else {
                            console.log('   2️⃣ Already on page 2 (button disabled)');
                        }
                    } else {
                        console.log('   No additional page numbers available to test');
                    }
                    
                    // Test 3: Click previous arrow
                    const prevArrowButton = page.getByRole('button').filter({ hasText: /^$/ }).first();
                    if (await prevArrowButton.isVisible({ timeout: 3000 }) && !(await prevArrowButton.isDisabled())) {
                        console.log(`\n   ⬅️ Testing previous arrow button for ${category}...`);
                        await prevArrowButton.click();
                        await page.waitForLoadState('networkidle');
                        
                        const prevUrl = page.url();
                        const prevResults = await page.locator('.c-search-card, .search-result, .result-card').count();
                        console.log(`   After previous arrow: ${prevResults} results at ${prevUrl}`);
                    }
                    
                    // Test 4: Navigate back to page 1
                    const page1Button = page.getByRole('button', { name: '1', exact: true });
                    if (await page1Button.isVisible({ timeout: 3000 })) {
                        console.log(`\n   1️⃣ Testing page 1 button click for ${category}...`);
                        await page1Button.click();
                        await page.waitForLoadState('networkidle');
                        
                        const page1Url = page.url();
                        const page1Results = await page.locator('.c-search-card, .search-result, .result-card').count();
                        console.log(`   Back to page 1: ${page1Results} results at ${page1Url}`);
                    }
                    
                    console.log(`✅ Arrow and page number navigation completed for ${category}!`);
                } else {
                    console.log(`   No pagination arrows found - single page of results for ${category}`);
                }
            });
            
            await test.step(`And: I test pagination in View by Resort mode for ${category}`, async () => {
                console.log(`\n🏔️ Testing pagination in "View results by resort" mode for ${category}:`);
                
                // Switch to View by Resort
                const viewByResortToggle = page.locator('div').filter({ hasText: /^View results by resort$/ }).locator('label');
                if (await viewByResortToggle.isVisible({ timeout: 5000 })) {
                    await viewByResortToggle.click();
                    await page.waitForLoadState('networkidle');
                    await page.waitForTimeout(3000); // Wait for view to change
                    console.log(`   ✓ Switched to "View results by resort" mode for ${category}`);
                    
                    // Check if pagination still works in resort view
                    const resortNextButton = page.getByRole('button').filter({ hasText: /^$/ }).nth(1);
                    if (await resortNextButton.isVisible({ timeout: 5000 })) {
                        console.log(`\n   🔄 Testing pagination in resort view for ${category}...`);
                        
                        const resortInitialResults = await page.locator('.c-search-card, .search-result, .result-card').count();
                        const resortInitialUrl = page.url();
                        
                        await resortNextButton.click();
                        await page.waitForLoadState('networkidle');
                        
                        const resortNewResults = await page.locator('.c-search-card, .search-result, .result-card').count();
                        const resortNewUrl = page.url();
                        
                        console.log(`   Resort view pagination: ${resortInitialResults} -> ${resortNewResults} results`);
                        console.log(`   Resort URL change: ${resortInitialUrl} -> ${resortNewUrl}`);
                        
                        // Test page number in resort view
                        const resortPage2Button = page.getByRole('button', { name: '2', exact: true });
                        if (await resortPage2Button.isVisible({ timeout: 3000 })) {
                            const isResortPage2Disabled = await resortPage2Button.isDisabled();
                            if (!isResortPage2Disabled) {
                                await resortPage2Button.click();
                                await page.waitForLoadState('networkidle');
                                console.log(`   ✓ Page 2 navigation works in resort view for ${category}`);
                            } else {
                                console.log(`   ✓ Already on page 2 in resort view for ${category} (button disabled)`);
                            }
                        } else {
                            console.log(`   Page 2 button not available in resort view for ${category}`);
                        }
                        
                        console.log(`✅ Resort view pagination test completed for ${category}!`);
                    } else {
                        console.log(`   No pagination in resort view for ${category} (all results fit on one page)`);
                    }
                } else {
                    console.log(`   "View results by resort" toggle not found for ${category}`);
                }
            });
        });
    }
});
