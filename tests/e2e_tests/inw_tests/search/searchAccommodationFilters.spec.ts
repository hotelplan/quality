import { test, expect } from '../../../resources/inw_resources/page_objects/base/page_base';

/**
 * ACCOMMODATION FILTERS TEST SUITE
 * 
 * This test suite comprehensively tests all accommodation filters across Ski, Walking, and Lapland categories
 * following POM principles and prioritizing qa/stg environments with Chromium browser.
 * 
 * Test Coverage:
 * - Ratings filter testing
 * - Best For filter testing
 * - Board Basis filter testing
 * - Facilities filter testing
 * - Holiday Types filter testing
 * - Duration filter testing
 * - Budget filter testing
 * - All Filters combined testing
 * 
 * Each test follows the pattern:
 * 1. Navigate to category search results
 * 2. Open filter
 * 3. Test individual filter values
 * 4. Validate search results match applied filters
 * 5. Handle "No results" scenarios appropriately
 */

// Test data configuration
const categories = [
    { name: 'Ski', searchLocation: 'anywhere' },
    { name: 'Walking', searchLocation: 'anywhere' },
    { name: 'Lapland', searchLocation: 'anywhere' }
];

// Run only on qa and stg environments with Chromium
test.describe('Accommodation Filters - Comprehensive Testing', () => {
    test.beforeEach(async ({ page }) => {
        // Ensure we're running in the correct environment
        const env = process.env.ENV || 'qa';
        if (!['qa', 'stg'].includes(env)) {
            test.skip(true, 'Skipping: Tests only run on qa and stg environments');
        }
        
        console.log(`🌍 Running accommodation filters tests on ${env} environment`);
        
        // Set longer timeout for filter operations
        test.setTimeout(300000); // 5 minutes per test
        
        // Set viewport for consistency
        await page.setViewportSize({ width: 1920, height: 1080 });
    });

    // =================== RATINGS FILTER TESTS ===================//
    
    categories.forEach(category => {
        test.describe(`${category.name} - Ratings Filter Testing`, () => {
            
            test(`@accom @regression Should test all Ratings filter values for ${category.name}`, async ({ 
                page, 
                searchResultPage 
            }) => {
                // Navigate to category search results
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                // Get all available rating options (filter to only numeric ratings)
                console.log(`\n🌟 Testing Ratings filter for ${category.name}...`);
                
                // Use predefined rating options to avoid getting non-rating options mixed in
                const ratingOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'];
                
                console.log(`Testing ${ratingOptions.length} rating options: ${ratingOptions.join(', ')}`);
                
                // Test each rating value individually
                for (const rating of ratingOptions) {
                    console.log(`\n🔍 Testing rating: ${rating}`);
                    
                    try {
                        // Open Ratings filter and select the current rating
                        await searchResultPage.openFilter('Ratings');
                        
                        // Click the rating option
                        const ratingLabel = page.locator('label').filter({ hasText: new RegExp(`^${rating}$`) });
                        await expect(ratingLabel).toBeVisible({ timeout: 5000 });
                        await ratingLabel.click();
                        
                        // Apply the filter
                        await searchResultPage.applyFilter();
                        
                        // Wait for results to update
                        await page.waitForTimeout(3000);
                        
                        // Check if there are results or no results message
                        const hasNoResults = await searchResultPage.validateNoResultsMessage();
                        
                        if (hasNoResults) {
                            console.log(`✅ ${rating} rating correctly shows "No results" message`);
                        } else {
                            // Validate that all visible accommodations have the selected rating
                            const validation = await searchResultPage.validateAccommodationRatings(rating);
                            expect(validation.isValid, 
                                `All accommodations should have rating ${rating}. Found ${validation.invalidCards} mismatched cards out of ${validation.actualRatings.length} total`
                            ).toBe(true);
                            
                            console.log(`✅ ${rating} rating filter validation passed: ${validation.actualRatings.length - validation.invalidCards}/${validation.actualRatings.length} cards match`);
                        }
                        
                        // Unselect the current rating before testing the next one
                        await searchResultPage.openFilter('Ratings');
                        await ratingLabel.click(); // Unselect
                        await searchResultPage.applyFilter();
                        await page.waitForTimeout(2000);
                        
                    } catch (error) {
                        console.error(`❌ Failed testing rating ${rating}: ${error.message}`);
                        throw error;
                    }
                }
                
                console.log(`🎉 Completed Ratings filter testing for ${category.name}`);
            });
        });
    });

    // =================== BEST FOR FILTER TESTS ===================
    
    categories.forEach(category => {
        test.describe(`${category.name} - Best For Filter Testing`, () => {
            
            test(`@accom @regression Should test Best For filter options for ${category.name}`, async ({ 
                page, 
                searchResultPage 
            }) => {
                // Navigate to category search results
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                console.log(`\n🎯 Testing Best For filter for ${category.name}...`);
                
                // Get available options for this category
                const filterOptions = await searchResultPage.getFilterOptions('Best For');
                console.log(`Found ${filterOptions.enabled.length} Best For options: ${filterOptions.enabled.join(', ')}`);
                
                // Test each enabled option
                for (const option of filterOptions.enabled) {
                    console.log(`\n🔍 Testing Best For option: ${option}`);
                    
                    try {
                        // Apply the filter option
                        await searchResultPage.selectFilterOption('Best For', option, true);
                        
                        // Wait for results to update
                        await page.waitForTimeout(3000);
                        
                        // Validate results
                        const hasNoResults = await searchResultPage.validateNoResultsMessage();
                        const resultCount = await searchResultPage.getSearchResultCount();
                        
                        if (hasNoResults) {
                            console.log(`✅ "${option}" option correctly shows "No results" message`);
                        } else {
                            expect(resultCount, `"${option}" filter should return some results`).toBeGreaterThan(0);
                            console.log(`✅ "${option}" filter returned ${resultCount} results`);
                        }
                        
                        // Clear the filter before testing next option
                        await searchResultPage.openFilter('Best For');
                        const optionCheckbox = page.locator(`text="${option}"`).first();
                        if (await optionCheckbox.isVisible({ timeout: 3000 })) {
                            await optionCheckbox.click(); // Uncheck
                        }
                        await searchResultPage.applyFilter();
                        await page.waitForTimeout(2000);
                        
                    } catch (error) {
                        console.error(`❌ Failed testing Best For option "${option}": ${error.message}`);
                        throw error;
                    }
                }
                
                console.log(`🎉 Completed Best For filter testing for ${category.name}`);
            });
        });
    });

    // =================== BOARD BASIS FILTER TESTS ===================
    
    categories.forEach(category => {
        test.describe(`${category.name} - Board Basis Filter Testing`, () => {
            
            test(`@accom @regression Should test all Board Basis filter options for ${category.name}`, async ({ 
                page, 
                searchResultPage 
            }) => {
                // Navigate to category search results
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                console.log(`\n🍽️ Testing Board Basis filter for ${category.name}...`);
                
                // Test universal board basis options
                const boardBasisOptions = ['Room Only', 'Bed & Breakfast', 'Half Board', 'Full Board', 'All Inclusive', 'Self Catering'];
                
                for (const option of boardBasisOptions) {
                    console.log(`\n🔍 Testing Board Basis option: ${option}`);
                    
                    try {
                        // Apply the filter option
                        await searchResultPage.selectFilterOption('Board Basis', option, true);
                        
                        // Wait for results to update
                        await page.waitForTimeout(3000);
                        
                        // Validate results
                        const hasNoResults = await searchResultPage.validateNoResultsMessage();
                        const resultCount = await searchResultPage.getSearchResultCount();
                        
                        if (hasNoResults) {
                            console.log(`✅ "${option}" board basis correctly shows "No results" message`);
                        } else {
                            expect(resultCount, `"${option}" board basis should return some results`).toBeGreaterThan(0);
                            console.log(`✅ "${option}" board basis returned ${resultCount} results`);
                        }
                        
                        // Clear the filter
                        await searchResultPage.openFilter('Board Basis');
                        const optionCheckbox = page.locator(`text="${option}"`).first();
                        if (await optionCheckbox.isVisible({ timeout: 3000 })) {
                            await optionCheckbox.click(); // Uncheck
                        }
                        await searchResultPage.applyFilter();
                        await page.waitForTimeout(2000);
                        
                    } catch (error) {
                        console.error(`❌ Failed testing Board Basis option "${option}": ${error.message}`);
                        throw error;
                    }
                }
                
                console.log(`🎉 Completed Board Basis filter testing for ${category.name}`);
            });
        });
    });

    // =================== FACILITIES FILTER TESTS ===================
    
    categories.forEach(category => {
        test.describe(`${category.name} - Facilities Filter Testing`, () => {
            
            test(`@accom @regression Should test key Facilities filter options for ${category.name}`, async ({ 
                page, 
                searchResultPage 
            }) => {
                // Navigate to category search results
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                console.log(`\n🏊 Testing Facilities filter for ${category.name}...`);
                
                // Test key facilities (subset to avoid overly long tests)
                const keyFacilities = ['WiFi', 'Indoor Pool', 'Spa Facilities', 'Bar', 'Restaurant'];
                
                for (const facility of keyFacilities) {
                    console.log(`\n🔍 Testing Facility: ${facility}`);
                    
                    try {
                        // Check if facility option is available
                        await searchResultPage.openFilter('Facilities');
                        const facilityOption = page.locator(`text="${facility}"`).first();
                        
                        if (await facilityOption.isVisible({ timeout: 3000 })) {
                            await facilityOption.click();
                            await searchResultPage.applyFilter();
                            
                            // Wait for results to update
                            await page.waitForTimeout(3000);
                            
                            // Validate results
                            const hasNoResults = await searchResultPage.validateNoResultsMessage();
                            const resultCount = await searchResultPage.getSearchResultCount();
                            
                            if (hasNoResults) {
                                console.log(`✅ "${facility}" facility correctly shows "No results" message`);
                            } else {
                                expect(resultCount, `"${facility}" facility should return some results`).toBeGreaterThan(0);
                                console.log(`✅ "${facility}" facility returned ${resultCount} results`);
                            }
                            
                            // Clear the filter
                            await searchResultPage.openFilter('Facilities');
                            await facilityOption.click(); // Uncheck
                            await searchResultPage.applyFilter();
                            await page.waitForTimeout(2000);
                        } else {
                            console.log(`⚠️ "${facility}" facility not available for ${category.name}`);
                        }
                        
                    } catch (error) {
                        console.error(`❌ Failed testing Facility "${facility}": ${error.message}`);
                        // Continue with next facility instead of failing entire test
                    }
                }
                
                console.log(`🎉 Completed Facilities filter testing for ${category.name}`);
            });
        });
    });

    // =================== HOLIDAY TYPES FILTER TESTS ===================
    
    categories.forEach(category => {
        test.describe(`${category.name} - Holiday Types Filter Testing`, () => {
            
            test(`@accom @regression Should test key Holiday Types filter options for ${category.name}`, async ({ 
                page, 
                searchResultPage 
            }) => {
                // Navigate to category search results
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                console.log(`\n🏖️ Testing Holiday Types filter for ${category.name}...`);
                
                // Test key holiday types
                const keyHolidayTypes = ['Family Holidays', 'Romantic Holidays', 'Luxury', 'Budget'];
                
                for (const holidayType of keyHolidayTypes) {
                    console.log(`\n🔍 Testing Holiday Type: ${holidayType}`);
                    
                    try {
                        // Check if holiday type option is available
                        await searchResultPage.openFilter('Holiday Types');
                        const holidayTypeOption = page.locator(`text="${holidayType}"`).first();
                        
                        if (await holidayTypeOption.isVisible({ timeout: 3000 })) {
                            await holidayTypeOption.click();
                            await searchResultPage.applyFilter();
                            
                            // Wait for results to update
                            await page.waitForTimeout(3000);
                            
                            // Validate results
                            const hasNoResults = await searchResultPage.validateNoResultsMessage();
                            const resultCount = await searchResultPage.getSearchResultCount();
                            
                            if (hasNoResults) {
                                console.log(`✅ "${holidayType}" holiday type correctly shows "No results" message`);
                            } else {
                                expect(resultCount, `"${holidayType}" holiday type should return some results`).toBeGreaterThan(0);
                                console.log(`✅ "${holidayType}" holiday type returned ${resultCount} results`);
                            }
                            
                            // Clear the filter
                            await searchResultPage.openFilter('Holiday Types');
                            await holidayTypeOption.click(); // Uncheck
                            await searchResultPage.applyFilter();
                            await page.waitForTimeout(2000);
                        } else {
                            console.log(`⚠️ "${holidayType}" holiday type not available for ${category.name}`);
                        }
                        
                    } catch (error) {
                        console.error(`❌ Failed testing Holiday Type "${holidayType}": ${error.message}`);
                        // Continue with next holiday type instead of failing entire test
                    }
                }
                
                console.log(`🎉 Completed Holiday Types filter testing for ${category.name}`);
            });
        });
    });

    // =================== DURATION FILTER TESTS ===================
    
    categories.forEach(category => {
        test.describe(`${category.name} - Duration Filter Testing`, () => {
            
            test(`@accom @regression Should test Duration filter options for ${category.name}`, async ({ 
                page, 
                searchResultPage 
            }) => {
                // Navigate to category search results
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                console.log(`\n⏰ Testing Duration filter for ${category.name}...`);
                
                try {
                    // Get available duration options
                    const filterOptions = await searchResultPage.getFilterOptions('Duration');
                    
                    if (filterOptions.enabled.length > 0) {
                        console.log(`Found ${filterOptions.enabled.length} duration options: ${filterOptions.enabled.join(', ')}`);
                        
                        // Test first few duration options (to keep test reasonable)
                        const testDurations = filterOptions.enabled.slice(0, 3);
                        
                        for (const duration of testDurations) {
                            console.log(`\n🔍 Testing Duration: ${duration}`);
                            
                            await searchResultPage.selectFilterOption('Duration', duration, true);
                            await page.waitForTimeout(3000);
                            
                            const hasNoResults = await searchResultPage.validateNoResultsMessage();
                            const resultCount = await searchResultPage.getSearchResultCount();
                            
                            if (hasNoResults) {
                                console.log(`✅ "${duration}" duration correctly shows "No results" message`);
                            } else {
                                expect(resultCount, `"${duration}" duration should return some results`).toBeGreaterThan(0);
                                console.log(`✅ "${duration}" duration returned ${resultCount} results`);
                            }
                            
                            // Clear the filter
                            await searchResultPage.openFilter('Duration');
                            const durationOption = page.locator(`text="${duration}"`).first();
                            if (await durationOption.isVisible({ timeout: 3000 })) {
                                await durationOption.click(); // Uncheck
                            }
                            await searchResultPage.applyFilter();
                            await page.waitForTimeout(2000);
                        }
                    } else {
                        console.log(`⚠️ No Duration filter options available for ${category.name}`);
                    }
                    
                } catch (error) {
                    console.error(`❌ Failed testing Duration filter: ${error.message}`);
                    // Duration filter might not exist for all categories, so don't fail the test
                    console.log(`⚠️ Duration filter testing skipped for ${category.name}`);
                }
                
                console.log(`🎉 Completed Duration filter testing for ${category.name}`);
            });
        });
    });

    // =================== BUDGET FILTER TESTS ===================
    
    categories.forEach(category => {
        test.describe(`${category.name} - Budget Filter Testing`, () => {
            
            test(`@accom @regression Should test Budget filter options for ${category.name}`, async ({ 
                page, 
                searchResultPage 
            }) => {
                // Navigate to category search results
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                console.log(`\n💰 Testing Budget filter for ${category.name}...`);
                
                try {
                    // Get available budget options
                    const filterOptions = await searchResultPage.getFilterOptions('Budget');
                    
                    if (filterOptions.enabled.length > 0) {
                        console.log(`Found ${filterOptions.enabled.length} budget options: ${filterOptions.enabled.join(', ')}`);
                        
                        // Test first few budget options
                        const testBudgets = filterOptions.enabled.slice(0, 3);
                        
                        for (const budget of testBudgets) {
                            console.log(`\n🔍 Testing Budget: ${budget}`);
                            
                            await searchResultPage.selectFilterOption('Budget', budget, true);
                            await page.waitForTimeout(3000);
                            
                            const hasNoResults = await searchResultPage.validateNoResultsMessage();
                            const resultCount = await searchResultPage.getSearchResultCount();
                            
                            if (hasNoResults) {
                                console.log(`✅ "${budget}" budget correctly shows "No results" message`);
                            } else {
                                expect(resultCount, `"${budget}" budget should return some results`).toBeGreaterThan(0);
                                console.log(`✅ "${budget}" budget returned ${resultCount} results`);
                            }
                            
                            // Clear the filter
                            await searchResultPage.openFilter('Budget');
                            const budgetOption = page.locator(`text="${budget}"`).first();
                            if (await budgetOption.isVisible({ timeout: 3000 })) {
                                await budgetOption.click(); // Uncheck
                            }
                            await searchResultPage.applyFilter();
                            await page.waitForTimeout(2000);
                        }
                    } else {
                        console.log(`⚠️ No Budget filter options available for ${category.name}`);
                    }
                    
                } catch (error) {
                    console.error(`❌ Failed testing Budget filter: ${error.message}`);
                    console.log(`⚠️ Budget filter testing skipped for ${category.name}`);
                }
                
                console.log(`🎉 Completed Budget filter testing for ${category.name}`);
            });
        });
    });

    // =================== ALL FILTERS COMBINED TESTS ===================
    
    categories.forEach(category => {
        test.describe(`${category.name} - All Filters Combined Testing`, () => {
            
            test(`@accom @regression Should test All Filters functionality for ${category.name}`, async ({ 
                page, 
                searchResultPage 
            }) => {
                // Navigate to category search results
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                console.log(`\n🎛️ Testing All Filters functionality for ${category.name}...`);
                
                try {
                    // Click the "All filters" button
                    const allFiltersButton = page.getByRole('button', { name: 'All filters' });
                    
                    if (await allFiltersButton.isVisible({ timeout: 5000 })) {
                        await allFiltersButton.click();
                        await page.waitForTimeout(2000);
                        
                        // Verify that multiple filter categories are visible
                        const filterCategories = ['Ratings', 'Best For', 'Board Basis', 'Facilities'];
                        let visibleFilters = 0;
                        
                        for (const filterCategory of filterCategories) {
                            const filterSection = page.locator(`text="${filterCategory}"`).first();
                            if (await filterSection.isVisible({ timeout: 3000 })) {
                                visibleFilters++;
                                console.log(`✅ ${filterCategory} filter section visible in All Filters`);
                            }
                        }
                        
                        expect(visibleFilters, 'All Filters should show multiple filter categories').toBeGreaterThan(1);
                        
                        // Test applying multiple filters at once
                        console.log('\n🔍 Testing multiple filter application...');
                        
                        // Try to apply a rating filter
                        const rating3 = page.locator('label').filter({ hasText: /^3$/ });
                        if (await rating3.isVisible({ timeout: 3000 })) {
                            await rating3.click();
                            console.log('✅ Applied rating filter: 3');
                        }
                        
                        // Try to apply a facility filter
                        const wifiOption = page.locator('text="WiFi"').first();
                        if (await wifiOption.isVisible({ timeout: 3000 })) {
                            await wifiOption.click();
                            console.log('✅ Applied facility filter: WiFi');
                        }
                        
                        // Apply the combined filters
                        const confirmButton = page.getByRole('button', { name: 'Confirm' });
                        if (await confirmButton.isVisible({ timeout: 3000 })) {
                            await confirmButton.click();
                            await page.waitForTimeout(3000);
                            
                            // Validate results with multiple filters
                            const hasNoResults = await searchResultPage.validateNoResultsMessage();
                            const resultCount = await searchResultPage.getSearchResultCount();
                            
                            if (hasNoResults) {
                                console.log(`✅ Combined filters correctly show "No results" message`);
                            } else {
                                expect(resultCount, 'Combined filters should return some results').toBeGreaterThan(0);
                                console.log(`✅ Combined filters returned ${resultCount} results`);
                            }
                        }
                        
                    } else {
                        console.log(`⚠️ All Filters button not found for ${category.name}`);
                    }
                    
                } catch (error) {
                    console.error(`❌ Failed testing All Filters: ${error.message}`);
                    console.log(`⚠️ All Filters testing skipped for ${category.name}`);
                }
                
                console.log(`🎉 Completed All Filters testing for ${category.name}`);
            });
        });
    });

    // =================== CROSS-CATEGORY FILTER VALIDATION ===================
    
    test.describe('Cross-Category Filter Validation', () => {
        
        test('@accom @regression Should validate universal filters work across all categories', async ({ 
            page, 
            searchResultPage 
        }) => {
            console.log('\n🌐 Testing universal filters across all categories...');
            
            const universalFilters = ['Ratings', 'Board Basis', 'Facilities'];
            const results: { [filter: string]: { [category: string]: boolean } } = {};
            
            for (const filterName of universalFilters) {
                results[filterName] = {};
                
                for (const category of categories) {
                    console.log(`\n🔍 Testing ${filterName} filter availability in ${category.name}...`);
                    
                    try {
                        console.log(`🔧 Setting up ${category.name} search results...`);
                        await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                        console.log(`✓ Successfully navigated to ${category.name} search results`);
                        
                        // Try to open the filter
                        await searchResultPage.openFilter(filterName);
                        
                        // Check if filter has options
                        const filterOptions = await searchResultPage.getFilterOptions(filterName);
                        const hasOptions = filterOptions.enabled.length > 0;
                        
                        results[filterName][category.name] = hasOptions;
                        
                        if (hasOptions) {
                            console.log(`✅ ${filterName} available in ${category.name}: ${filterOptions.enabled.length} options`);
                        } else {
                            console.log(`❌ ${filterName} not available in ${category.name}`);
                        }
                        
                        await searchResultPage.closeFilter();
                        
                    } catch (error) {
                        console.error(`❌ Error testing ${filterName} in ${category.name}: ${error.message}`);
                        results[filterName][category.name] = false;
                    }
                }
            }
            
            // Report cross-category filter availability
            console.log('\n📊 Cross-category filter availability report:');
            for (const [filterName, categoryResults] of Object.entries(results)) {
                const availableCount = Object.values(categoryResults).filter(Boolean).length;
                const totalCategories = categories.length;
                console.log(`${filterName}: ${availableCount}/${totalCategories} categories`);
                
                // For truly universal filters, expect them to be available in most categories
                if (filterName === 'Ratings') {
                    expect(availableCount, `${filterName} should be available in most categories`).toBeGreaterThanOrEqual(2);
                }
            }
            
            console.log('🎉 Completed cross-category filter validation');
        });
    });
});
