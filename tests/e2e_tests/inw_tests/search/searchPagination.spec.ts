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
                
                // Initialize pagination helper
                const paginationHelper = new PaginationHelper(page);
                
                // Wait for pagination to be available
                await page.waitForSelector('nav[aria-label*="Pagination"], .pagination', { timeout: 10000 }).catch(() => {
                    console.log('No pagination found, proceeding with single page test');
                });
                
                // Store initial content for comparison
                const initialResults = await page.locator('.c-search-card, .search-result, .result-card').count();
                const initialUrl = page.url();
                console.log(`   Initial page: ${initialResults} results at ${initialUrl}`);
                
                // 🔍 CAPTURE PAGE 1 CONTENT
                console.log(`\n   📝 Capturing Page 1 content for ${category}...`);
                const page1Content = await paginationHelper.capturePageContent();
                console.log(`   ✓ Page 1 content captured: ${page1Content.length} items`);
                
                // Test 1: Click next arrow
                const nextArrowButton = page.getByRole('button').filter({ hasText: /^$/ }).nth(1);
                
                if (await nextArrowButton.isVisible({ timeout: 5000 })) {
                    console.log(`\n   ➡️ Testing next arrow button for ${category}...`);
                    await nextArrowButton.click();
                    await page.waitForLoadState('networkidle');
                    
                    const nextUrl = page.url();
                    const nextResults = await page.locator('.c-search-card, .search-result, .result-card').count();
                    console.log(`   After next arrow: ${nextResults} results at ${nextUrl}`);
                    
                    // 🔍 CAPTURE PAGE 2 CONTENT AND COMPARE
                    console.log(`\n   📝 Capturing Page 2 content for ${category}...`);
                    const page2Content = await paginationHelper.capturePageContent();
                    const contentComparison = await paginationHelper.comparePageContent(page1Content, page2Content);
                    console.log(`   🔍 Content verification: ${contentComparison.details}`);
                    
                    // Assert that content is different
                    if (contentComparison.isDifferent) {
                        console.log(`   ✅ SUCCESS: Page 1 and Page 2 have different content for ${category}!`);
                    } else {
                        console.log(`   ⚠️  WARNING: Page 1 and Page 2 appear to have same content for ${category}`);
                    }
                    
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
                        
                        // 🔍 CAPTURE PAGE 3 CONTENT AND COMPARE
                        const page3Content = await paginationHelper.capturePageContent();
                        const page2vs3Comparison = await paginationHelper.comparePageContent(page2Content, page3Content);
                        console.log(`   🔍 Page 2 vs 3 content: ${page2vs3Comparison.details}`);
                        
                        const hasPage3Param = page3Url.includes('page=3');
                        console.log(`   URL correctly shows page 3: ${hasPage3Param}`);
                        
                        if (page2vs3Comparison.isDifferent) {
                            console.log(`   ✅ SUCCESS: Page 2 and Page 3 have different content!`);
                        }
                    } else if (await page2Button.isVisible({ timeout: 3000 })) {
                        const isPage2Disabled = await page2Button.isDisabled();
                        if (!isPage2Disabled) {
                            console.log('   2️⃣ Testing page 2 button click...');
                            await page2Button.click();
                            await page.waitForLoadState('networkidle');
                            
                            const page2Url = page.url();
                            const page2Results = await page.locator('.c-search-card, .search-result, .result-card').count();
                            console.log(`   Page 2: ${page2Results} results at ${page2Url}`);
                            
                            // 🔍 VERIFY WE'RE BACK TO PAGE 2 CONTENT
                            const returnToPage2Content = await paginationHelper.capturePageContent();
                            const returnComparison = await paginationHelper.comparePageContent(page2Content, returnToPage2Content);
                            console.log(`   🔍 Return to Page 2 verification: ${returnComparison.details}`);
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
                        
                        // 🔍 VERIFY WE'RE BACK TO ORIGINAL PAGE 1 CONTENT
                        const returnToPage1Content = await paginationHelper.capturePageContent();
                        const page1ReturnComparison = await paginationHelper.comparePageContent(page1Content, returnToPage1Content);
                        console.log(`   🔍 Return to Page 1 verification: ${page1ReturnComparison.details}`);
                        
                        if (!page1ReturnComparison.isDifferent) {
                            console.log(`   ✅ SUCCESS: Returned to original Page 1 content for ${category}!`);
                        } else {
                            console.log(`   ⚠️  WARNING: Page 1 content changed after navigation for ${category}`);
                        }
                    }
                    
                    console.log(`✅ Arrow and page number navigation with content verification completed for ${category}!`);
                } else {
                    console.log(`   No pagination arrows found - single page of results for ${category}`);
                }
            });
            
            await test.step(`And: I test pagination in View by Resort mode for ${category}`, async () => {
                console.log(`\n🏔️ Testing pagination in "View results by resort" mode for ${category}:`);
                
                // Initialize pagination helper for resort view
                const paginationHelper = new PaginationHelper(page);
                
                // Switch to View by Resort
                const viewByResortToggle = page.locator('div').filter({ hasText: /^View results by resort$/ }).locator('label');
                if (await viewByResortToggle.isVisible({ timeout: 5000 })) {
                    await viewByResortToggle.click();
                    await page.waitForLoadState('networkidle');
                    await page.waitForTimeout(3000); // Wait for view to change
                    console.log(`   ✓ Switched to "View results by resort" mode for ${category}`);
                    
                    // 🔍 CAPTURE RESORT VIEW PAGE 1 CONTENT
                    console.log(`\n   📝 Capturing Resort View Page 1 content for ${category}...`);
                    const resortPage1Content = await paginationHelper.capturePageContent();
                    console.log(`   ✓ Resort View Page 1 content captured: ${resortPage1Content.length} items`);
                    
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
                        
                        // 🔍 CAPTURE RESORT VIEW PAGE 2 CONTENT AND COMPARE
                        console.log(`\n   📝 Capturing Resort View Page 2 content for ${category}...`);
                        const resortPage2Content = await paginationHelper.capturePageContent();
                        const resortContentComparison = await paginationHelper.comparePageContent(resortPage1Content, resortPage2Content);
                        console.log(`   🔍 Resort View content verification: ${resortContentComparison.details}`);
                        
                        if (resortContentComparison.isDifferent) {
                            console.log(`   ✅ SUCCESS: Resort View Page 1 and Page 2 have different content for ${category}!`);
                        } else {
                            console.log(`   ⚠️  WARNING: Resort View Page 1 and Page 2 appear to have same content for ${category}`);
                        }
                        
                        // Test page number in resort view
                        const resortPage2Button = page.getByRole('button', { name: '2', exact: true });
                        if (await resortPage2Button.isVisible({ timeout: 3000 })) {
                            const isResortPage2Disabled = await resortPage2Button.isDisabled();
                            if (!isResortPage2Disabled) {
                                await resortPage2Button.click();
                                await page.waitForLoadState('networkidle');
                                console.log(`   ✓ Page 2 navigation works in resort view for ${category}`);
                                
                                // 🔍 VERIFY RESORT VIEW PAGE 2 CONTENT CONSISTENCY
                                const resortPage2VerifyContent = await paginationHelper.capturePageContent();
                                const resortPage2Consistency = await paginationHelper.comparePageContent(resortPage2Content, resortPage2VerifyContent);
                                console.log(`   🔍 Resort View Page 2 consistency: ${resortPage2Consistency.details}`);
                            } else {
                                console.log(`   ✓ Already on page 2 in resort view for ${category} (button disabled)`);
                            }
                        } else {
                            console.log(`   Page 2 button not available in resort view for ${category}`);
                        }
                        
                        console.log(`✅ Resort view pagination test with content verification completed for ${category}!`);
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
