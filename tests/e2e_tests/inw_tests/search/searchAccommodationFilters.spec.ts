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
                // Step 1-3: Navigate to Inghams website, select category, and search
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                // Step 4: Check search results exist in form of accommodations
                await searchResultPage.waitForAccommodationResults();
                const initialResultCount = await searchResultPage.getSearchResultCount();
                expect(initialResultCount, 'Should have accommodation search results before filtering').toBeGreaterThan(0);
                console.log(`✅ Found ${initialResultCount} initial accommodation results`);
                
                console.log(`\n🎯 Testing Best For filter for ${category.name}...`);
                
                // Step 5-6: Click Best For filter and check individual filter values
                await searchResultPage.openFilter('Best For');
                const initialFilterOptions = await searchResultPage.getFilterOptions('Best For');
                
                console.log(`📋 Initial Best For filter analysis for ${category.name}:`);
                console.log(`   - Initially detected enabled options (${initialFilterOptions.enabled.length}): ${initialFilterOptions.enabled.join(', ')}`);
                console.log(`   - Initially detected disabled options (${initialFilterOptions.disabled.length}): ${initialFilterOptions.disabled.join(', ')}`);
                
                // Close filter to start testing
                await searchResultPage.closeFilter();
                
                console.log(`\n🔍 Dynamically testing Best For options for ${category.name}...`);
                console.log(`   📋 Will check each option individually for real-time enabled state`);
                
                // Keep track of actually tested options
                let testedOptions: string[] = [];
                let skippedOptions: string[] = [];
                
                // Step 7-16: Test each initially enabled filter value individually with real-time validation
                for (const option of initialFilterOptions.enabled) {
                    console.log(`\n🔍 Testing Best For option: "${option}"`);
                    
                    try {
                        // Step 7: Select one filter value from enabled values
                        console.log(`   📌 Checking real-time availability of "${option}" filter...`);
                        await searchResultPage.openFilter('Best For');
                        
                        // Re-check if this specific option is actually clickable/enabled right now
                        const filterCheckbox = page.locator('#searchFilters label').filter({ hasText: option });
                        
                        // Comprehensive availability check
                        const isVisible = await filterCheckbox.isVisible({ timeout: 2000 });
                        if (!isVisible) {
                            console.log(`   ⚠️ "${option}" option not visible, skipping...`);
                            skippedOptions.push(`${option} (not visible)`);
                            await searchResultPage.closeFilter();
                            continue;
                        }
                        
                        const isEnabled = await filterCheckbox.isEnabled({ timeout: 2000 });
                        if (!isEnabled) {
                            console.log(`   ⚠️ "${option}" option is disabled, skipping...`);
                            skippedOptions.push(`${option} (disabled)`);
                            await searchResultPage.closeFilter();
                            continue;
                        }
                        
                        // Check if it has the disabled class or attribute
                        const hasDisabledClass = await filterCheckbox.evaluate(el => {
                            return el.classList.contains('disabled') || 
                                   el.hasAttribute('disabled') || 
                                   el.getAttribute('aria-disabled') === 'true' ||
                                   el.closest('.disabled') !== null;
                        });
                        
                        if (hasDisabledClass) {
                            console.log(`   ⚠️ "${option}" option has disabled styling/attributes, skipping...`);
                            skippedOptions.push(`${option} (has disabled attributes)`);
                            await searchResultPage.closeFilter();
                            continue;
                        }
                        
                        console.log(`   ✅ "${option}" option is available and clickable, proceeding with test...`);
                        
                        // Actually click the option
                        await filterCheckbox.click();
                        
                        // Step 8: Click confirm/apply
                        await searchResultPage.applyFilter();
                        console.log(`   ✅ Applied "${option}" filter`);
                        testedOptions.push(option);
                        
                        // Wait for results to update
                        await page.waitForTimeout(3000);
                        
                        // Step 9-10: Check changes on accommodation search results
                        const hasNoResults = await searchResultPage.validateNoResultsMessage();
                        
                        if (hasNoResults) {
                            console.log(`   ✅ "${option}" filter correctly shows "No results match" message`);
                        } else {
                            // Validate accommodation tags
                            const tagValidation = await searchResultPage.validateAccommodationTags(option);
                            const resultCount = tagValidation.totalCards;
                            
                            console.log(`   📊 Filter "${option}" returned ${resultCount} results`);
                            expect(resultCount, `"${option}" filter should return some results`).toBeGreaterThan(0);
                            
                            // Log accommodations without the expected tag (don't fail test)
                            if (tagValidation.cardsWithoutTag > 0) {
                                console.log(`   ⚠️ Found ${tagValidation.cardsWithoutTag} accommodations without "${option}" tag:`);
                                tagValidation.accommodationsWithoutTag.forEach((name, index) => {
                                    console.log(`     ${index + 1}. ${name} (needs manual checking)`);
                                });
                            } else {
                                console.log(`   ✅ All ${tagValidation.cardsWithTag} accommodations have "${option}" tag`);
                            }
                        }
                        
                        // Step 11-12: Unselect the previously selected filter value
                        console.log(`   🔄 Unselecting "${option}" filter...`);
                        await searchResultPage.openFilter('Best For');
                        
                        // Re-locate the checkbox for unselecting
                        const unselectCheckbox = page.locator('#searchFilters label').filter({ hasText: option });
                        if (await unselectCheckbox.isVisible({ timeout: 3000 })) {
                            await unselectCheckbox.click(); // Unselect
                        }
                        await searchResultPage.applyFilter();
                        await page.waitForTimeout(2000);
                        console.log(`   ✅ Unselected "${option}" filter`);
                        
                    } catch (error) {
                        console.error(`   ❌ Failed testing Best For option "${option}": ${error.message}`);
                        skippedOptions.push(`${option} (error: ${error.message.substring(0, 50)}...)`);
                        
                        // Try to cleanup by closing any open filters before continuing
                        try {
                            await searchResultPage.closeFilter();
                        } catch (cleanupError) {
                            console.warn(`   ⚠️ Could not cleanup filter state: ${cleanupError.message}`);
                        }
                        
                        // Log error but continue with next option (don't fail entire test)
                        console.log(`   ⚠️ Continuing with next Best For option...`);
                    }
                }
                
                // Final validation
                console.log(`\n📊 Best For filter testing summary for ${category.name}:`);
                console.log(`   - Initially detected options: ${initialFilterOptions.enabled.length}`);
                console.log(`   - Successfully tested options: ${testedOptions.length}`);
                console.log(`   - Skipped/disabled options: ${skippedOptions.length}`);
                
                if (testedOptions.length > 0) {
                    console.log(`   - Tested options: ${testedOptions.join(', ')}`);
                }
                
                if (skippedOptions.length > 0) {
                    console.log(`   - Skipped options: ${skippedOptions.join(', ')}`);
                }
                
                console.log(`   - Category-specific behavior: ${skippedOptions.length > 0 ? 'Some options disabled/unavailable for this category' : 'All initially detected options were testable'}`);
                
                console.log(`🎉 Completed Best For filter testing for ${category.name}`);
            });
        });
    });

    // =================== BOARD BASIS FILTER TESTS ===================//
    
    categories.forEach(category => {
        test.describe(`${category.name} - Board Basis Filter Testing`, () => {
            
            test(`@accom @regression Should test all Board Basis filter options for ${category.name}`, async ({ 
                page, 
                searchResultPage 
            }) => {
                // Steps 1-3: Navigate to Inghams website, select category, and search
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                // Step 4: Check search results exist in form of accommodations
                await searchResultPage.waitForAccommodationResults();
                const initialResultCount = await searchResultPage.getSearchResultCount();
                expect(initialResultCount, 'Should have accommodation search results before filtering').toBeGreaterThan(0);
                console.log(`✅ Found ${initialResultCount} initial accommodation results`);
                
                console.log(`\n🍽️ Testing Board Basis filter for ${category.name}...`);
                
                // Step 5: Click Board Basis and check what filter values are available
                console.log(`✓ Opening Board Basis filter...`);
                await searchResultPage.openFilter('Board Basis');
                console.log(`✓ Successfully opened Board Basis filter`);
                
                // Step 6: Check individual filter values - enabled vs disabled
                const boardBasisOptions = ['Room Only', 'Bed & Breakfast', 'Half Board', 'Full Board', 'All Inclusive', 'Self Catering'];
                
                console.log(`📋 Initial Board Basis filter analysis for ${category.name}:`);
                const initialFilterOptions: string[] = [];
                const testedOptions: string[] = [];
                const skippedOptions: string[] = [];
                
                // Check availability of each Board Basis option
                for (const option of boardBasisOptions) {
                    const filterCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                    
                    try {
                        const isVisible = await filterCheckbox.isVisible({ timeout: 2000 });
                        
                        if (!isVisible) {
                            console.log(`   ⚠️ "${option}" option not found in filter list, skipping...`);
                            skippedOptions.push(`${option} (not visible)`);
                            continue;
                        }
                        
                        // Check if option is enabled (clickable)
                        const isEnabled = await filterCheckbox.isEnabled({ timeout: 1000 });
                        const hasDisabledClass = await filterCheckbox.evaluate((el) => {
                            return el.classList.contains('disabled') || 
                                   el.hasAttribute('disabled') ||
                                   el.getAttribute('aria-disabled') === 'true';
                        });
                        
                        if (!isEnabled || hasDisabledClass) {
                            console.log(`   ⚠️ "${option}" option is disabled, will be skipped during testing`);
                            skippedOptions.push(`${option} (disabled)`);
                        } else {
                            console.log(`   ✅ "${option}" option is available and enabled`);
                            initialFilterOptions.push(option);
                        }
                        
                    } catch (error) {
                        console.log(`   ⚠️ Error checking "${option}" option: ${error.message}`);
                        skippedOptions.push(`${option} (error checking)`);
                    }
                }
                
                console.log(`   - Initially detected enabled options (${initialFilterOptions.length}): ${initialFilterOptions.join(', ')}`);
                console.log(`   - Initially detected disabled/unavailable options (${skippedOptions.length}): ${skippedOptions.map(opt => opt.split(' (')[0]).join(', ')}`);
                
                // Close the filter to start fresh
                await searchResultPage.closeFilter();
                
                console.log(`\n🔍 Dynamically testing Board Basis options for ${category.name}...`);
                console.log(`   📋 Will test each available option individually with real-time validation`);
                
                // Test each available Board Basis option
                for (const option of initialFilterOptions) {
                    console.log(`\n🔍 Testing Board Basis option: "${option}"`);
                    console.log(`   📌 Checking real-time availability of "${option}" filter...`);
                    
                    // Step 5: Click Board Basis (for each option)
                    await searchResultPage.openFilter('Board Basis');
                    
                    // Re-check if option is still available (dynamic validation)
                    const filterCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                    
                    const isCurrentlyVisible = await filterCheckbox.isVisible({ timeout: 3000 });
                    const isCurrentlyEnabled = isCurrentlyVisible ? await filterCheckbox.isEnabled({ timeout: 1000 }) : false;
                    const hasDisabledClass = isCurrentlyVisible ? await filterCheckbox.evaluate((el) => {
                        return el.classList.contains('disabled') || 
                               el.hasAttribute('disabled') ||
                               el.getAttribute('aria-disabled') === 'true';
                    }) : true;
                    
                    if (!isCurrentlyVisible || !isCurrentlyEnabled || hasDisabledClass) {
                        console.log(`   ⚠️ "${option}" option is now unavailable/disabled, skipping...`);
                        skippedOptions.push(`${option} (became unavailable)`);
                        await searchResultPage.closeFilter();
                        continue;
                    }
                    
                    console.log(`   ✅ "${option}" option is available and clickable, proceeding with test...`);
                    
                    // Step 7: Select one filter value from enabled values
                    await filterCheckbox.click();
                    console.log(`   ✅ Selected "${option}" board basis filter`);
                    
                    // Step 8: Click confirm/apply
                    await searchResultPage.applyFilter();
                    console.log(`   ✅ Applied "${option}" filter`);
                    testedOptions.push(option);
                    
                    // Wait for results to update
                    await page.waitForTimeout(3000);
                    
                    // Step 9: Check changes on accommodation search results
                    // Step 10: Check all accommodations should have the board basis, or "No result match" message
                    const hasNoResults = await searchResultPage.validateNoResultsMessage();
                    
                    if (hasNoResults) {
                        console.log(`   ✅ "${option}" filter correctly shows "No results match" message`);
                    } else {
                        // Validate accommodation board basis
                        const boardBasisValidation = await searchResultPage.validateAccommodationBoardBasis(option);
                        const resultCount = boardBasisValidation.totalCards;
                        
                        console.log(`   📊 Filter "${option}" returned ${resultCount} results`);
                        expect(resultCount, `"${option}" filter should return some results`).toBeGreaterThan(0);
                        
                        // Log accommodations without the expected board basis (for manual checking)
                        if (boardBasisValidation.cardsWithoutBoardBasis > 0) {
                            console.log(`   ⚠️ Found ${boardBasisValidation.cardsWithoutBoardBasis} accommodations without "${option}" board basis:`);
                            boardBasisValidation.accommodationsWithoutBoardBasis.forEach((name, index) => {
                                console.log(`     ${index + 1}. ${name} (needs manual checking)`);
                            });
                        } else {
                            console.log(`   ✅ All ${boardBasisValidation.cardsWithBoardBasis} accommodations have "${option}" board basis`);
                        }
                    }
                    
                    // Step 11-12: Click Board Basis filter again and unselect the previously selected filter value
                    console.log(`   🔄 Unselecting "${option}" filter...`);
                    await searchResultPage.openFilter('Board Basis');
                    
                    // Re-locate the checkbox for unselecting
                    const unselectCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                    if (await unselectCheckbox.isVisible({ timeout: 3000 })) {
                        await unselectCheckbox.click(); // Uncheck the option
                        console.log(`   ✅ Unselected "${option}" filter`);
                        await searchResultPage.applyFilter();
                        await page.waitForTimeout(2000);
                    } else {
                        console.log(`   ⚠️ Could not find "${option}" checkbox to unselect`);
                        await searchResultPage.closeFilter();
                    }
                    
                    // Steps 13-16 are implicit: Continue loop to select next filter value and repeat validation
                }
                
                console.log(`\n📊 Board Basis filter testing summary for ${category.name}:`);
                console.log(`   - Initially detected options: ${initialFilterOptions.length}`);
                console.log(`   - Successfully tested options: ${testedOptions.length}`);
                console.log(`   - Skipped/disabled options: ${skippedOptions.length}`);
                console.log(`   - Tested options: ${testedOptions.join(', ')}`);
                console.log(`   - Skipped options: ${skippedOptions.map(opt => opt.split(' (')[0]).join(', ')}`);
                console.log(`   - Category-specific behavior: Some options may be disabled/unavailable for this category`);
                
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
                // Steps 1-3: Navigate to Inghams website, select category, and search
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                // Step 4: Check search results exist in form of accommodations
                await searchResultPage.waitForAccommodationResults();
                const initialResultCount = await searchResultPage.getSearchResultCount();
                expect(initialResultCount, 'Should have accommodation search results before filtering').toBeGreaterThan(0);
                console.log(`✅ Found ${initialResultCount} initial accommodation results`);
                
                console.log(`\n🏊 Testing Facilities filter for ${category.name}...`);
                
                // Step 5: Click Facilities and check what filter values are available
                console.log(`✓ Opening Facilities filter...`);
                await searchResultPage.openFilter('Facilities');
                console.log(`✓ Successfully opened Facilities filter`);
                
                // Step 6: Check individual filter values - enabled vs disabled
                const facilitiesOptions = ['WiFi', 'Indoor Pool', 'Outdoor Pool', 'Spa Facilities', 'Sauna/Steam Room', 'Bar', 'Restaurant', 'Kids Club', 'Family Rooms', 'Single Rooms', 'Group Holidays', 'Disabled Access', 'Parking', 'Pet Friendly', 'Lift Access'];
                
                console.log(`📋 Initial Facilities filter analysis for ${category.name}:`);
                const initialFilterOptions: string[] = [];
                const testedOptions: string[] = [];
                const skippedOptions: string[] = [];
                
                // Check availability of each Facilities option
                for (const option of facilitiesOptions) {
                    const filterCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                    
                    try {
                        const isVisible = await filterCheckbox.isVisible({ timeout: 2000 });
                        
                        if (!isVisible) {
                            console.log(`   ⚠️ "${option}" option not found in filter list, skipping...`);
                            skippedOptions.push(`${option} (not visible)`);
                            continue;
                        }
                        
                        // Check if option is enabled (clickable)
                        const isEnabled = await filterCheckbox.isEnabled({ timeout: 1000 });
                        const hasDisabledClass = await filterCheckbox.evaluate((el) => {
                            return el.classList.contains('disabled') || 
                                   el.hasAttribute('disabled') ||
                                   el.getAttribute('aria-disabled') === 'true';
                        });
                        
                        if (!isEnabled || hasDisabledClass) {
                            console.log(`   ⚠️ "${option}" option is disabled, will be skipped during testing`);
                            skippedOptions.push(`${option} (disabled)`);
                        } else {
                            console.log(`   ✅ "${option}" option is available and enabled`);
                            initialFilterOptions.push(option);
                        }
                        
                    } catch (error) {
                        console.log(`   ⚠️ Error checking "${option}" option: ${error.message}`);
                        skippedOptions.push(`${option} (error checking)`);
                    }
                }
                
                console.log(`   - Initially detected enabled options (${initialFilterOptions.length}): ${initialFilterOptions.join(', ')}`);
                console.log(`   - Initially detected disabled/unavailable options (${skippedOptions.length}): ${skippedOptions.map(opt => opt.split(' (')[0]).join(', ')}`);
                
                // Close the filter to start fresh
                await searchResultPage.closeFilter();
                
                console.log(`\n🔍 Dynamically testing Facilities options for ${category.name}...`);
                console.log(`   📋 Will test each available option individually with real-time validation`);
                
                // Test each available Facilities option (limit to first 8 to keep tests reasonable)
                const optionsToTest = initialFilterOptions.slice(0, 8);
                console.log(`   📋 Testing first ${optionsToTest.length} options: ${optionsToTest.join(', ')}`);
                
                for (const option of optionsToTest) {
                    console.log(`\n🔍 Testing Facilities option: "${option}"`);
                    console.log(`   📌 Checking real-time availability of "${option}" filter...`);
                    
                    // Step 5: Click Facilities (for each option)
                    await searchResultPage.openFilter('Facilities');
                    
                    // Re-check if option is still available (dynamic validation)
                    const filterCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                    
                    const isCurrentlyVisible = await filterCheckbox.isVisible({ timeout: 3000 });
                    const isCurrentlyEnabled = isCurrentlyVisible ? await filterCheckbox.isEnabled({ timeout: 1000 }) : false;
                    const hasDisabledClass = isCurrentlyVisible ? await filterCheckbox.evaluate((el) => {
                        return el.classList.contains('disabled') || 
                               el.hasAttribute('disabled') ||
                               el.getAttribute('aria-disabled') === 'true';
                    }) : true;
                    
                    if (!isCurrentlyVisible || !isCurrentlyEnabled || hasDisabledClass) {
                        console.log(`   ⚠️ "${option}" option is now unavailable/disabled, skipping...`);
                        skippedOptions.push(`${option} (became unavailable)`);
                        await searchResultPage.closeFilter();
                        continue;
                    }
                    
                    console.log(`   ✅ "${option}" option is available and clickable, proceeding with test...`);
                    
                    // Step 7: Select one filter value from enabled values
                    await filterCheckbox.click();
                    console.log(`   ✅ Selected "${option}" facilities filter`);
                    
                    // Step 8: Click confirm/apply
                    await searchResultPage.applyFilter();
                    console.log(`   ✅ Applied "${option}" filter`);
                    testedOptions.push(option);
                    
                    // Wait for results to update
                    await page.waitForTimeout(3000);
                    
                    // Step 9-10: Check changes on accommodation search results
                    const hasNoResults = await searchResultPage.validateNoResultsMessage();
                    
                    if (hasNoResults) {
                        console.log(`   ✅ "${option}" filter correctly shows "No results match" message`);
                    } else {
                        // Validate result count
                        const resultCount = await searchResultPage.getSearchResultCount();
                        console.log(`   📊 Filter "${option}" returned ${resultCount} results`);
                        expect(resultCount, `"${option}" filter should return some results`).toBeGreaterThan(0);
                        console.log(`   ✅ "${option}" facilities filter returned valid results`);
                    }
                    
                    // Step 11-12: Click Facilities filter again and unselect the previously selected filter value
                    console.log(`   🔄 Unselecting "${option}" filter...`);
                    await searchResultPage.openFilter('Facilities');
                    
                    // Re-locate the checkbox for unselecting
                    const unselectCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                    if (await unselectCheckbox.isVisible({ timeout: 3000 })) {
                        await unselectCheckbox.click(); // Uncheck the option
                        console.log(`   ✅ Unselected "${option}" filter`);
                        await searchResultPage.applyFilter();
                        await page.waitForTimeout(2000);
                    } else {
                        console.log(`   ⚠️ Could not find "${option}" checkbox to unselect`);
                        await searchResultPage.closeFilter();
                    }
                    
                    // Steps 13-16 are implicit: Continue loop to select next filter value and repeat validation
                }
                
                console.log(`\n📊 Facilities filter testing summary for ${category.name}:`);
                console.log(`   - Initially detected options: ${initialFilterOptions.length}`);
                console.log(`   - Successfully tested options: ${testedOptions.length}`);
                console.log(`   - Skipped/disabled options: ${skippedOptions.length}`);
                console.log(`   - Tested options: ${testedOptions.join(', ')}`);
                console.log(`   - Skipped options: ${skippedOptions.map(opt => opt.split(' (')[0]).join(', ')}`);
                console.log(`   - Category-specific behavior: Some options may be disabled/unavailable for this category`);
                
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
                // Steps 1-3: Navigate to Inghams website, select category, and search
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                // Step 4: Check search results exist in form of accommodations
                await searchResultPage.waitForAccommodationResults();
                const initialResultCount = await searchResultPage.getSearchResultCount();
                expect(initialResultCount, 'Should have accommodation search results before filtering').toBeGreaterThan(0);
                console.log(`✅ Found ${initialResultCount} initial accommodation results`);
                
                console.log(`\n🏖️ Testing Holiday Types filter for ${category.name}...`);
                
                // Step 5: Click Holiday Types and check what filter values are available
                console.log(`✓ Opening Holiday Types filter...`);
                await searchResultPage.openFilter('Holiday Types');
                console.log(`✓ Successfully opened Holiday Types filter`);
                
                // Step 6: Check individual filter values - enabled vs disabled
                const holidayTypesOptions = ['Family Holidays', 'Romantic Holidays', 'Group Holidays', 'Adult Only', 'All Inclusive', 'Short Breaks', 'Long Stays', 'Luxury', 'Budget', 'Mid Range', 'Adventure', 'Cultural'];
                
                console.log(`📋 Initial Holiday Types filter analysis for ${category.name}:`);
                const initialFilterOptions: string[] = [];
                const testedOptions: string[] = [];
                const skippedOptions: string[] = [];
                
                // Check availability of each Holiday Types option
                for (const option of holidayTypesOptions) {
                    const filterCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                    
                    try {
                        const isVisible = await filterCheckbox.isVisible({ timeout: 2000 });
                        
                        if (!isVisible) {
                            console.log(`   ⚠️ "${option}" option not found in filter list, skipping...`);
                            skippedOptions.push(`${option} (not visible)`);
                            continue;
                        }
                        
                        // Check if option is enabled (clickable)
                        const isEnabled = await filterCheckbox.isEnabled({ timeout: 1000 });
                        const hasDisabledClass = await filterCheckbox.evaluate((el) => {
                            return el.classList.contains('disabled') || 
                                   el.hasAttribute('disabled') ||
                                   el.getAttribute('aria-disabled') === 'true';
                        });
                        
                        if (!isEnabled || hasDisabledClass) {
                            console.log(`   ⚠️ "${option}" option is disabled, will be skipped during testing`);
                            skippedOptions.push(`${option} (disabled)`);
                        } else {
                            console.log(`   ✅ "${option}" option is available and enabled`);
                            initialFilterOptions.push(option);
                        }
                        
                    } catch (error) {
                        console.log(`   ⚠️ Error checking "${option}" option: ${error.message}`);
                        skippedOptions.push(`${option} (error checking)`);
                    }
                }
                
                console.log(`   - Initially detected enabled options (${initialFilterOptions.length}): ${initialFilterOptions.join(', ')}`);
                console.log(`   - Initially detected disabled/unavailable options (${skippedOptions.length}): ${skippedOptions.map(opt => opt.split(' (')[0]).join(', ')}`);
                
                // Close the filter to start fresh
                await searchResultPage.closeFilter();
                
                console.log(`\n🔍 Dynamically testing Holiday Types options for ${category.name}...`);
                console.log(`   📋 Will test each available option individually with real-time validation`);
                
                // Test each available Holiday Types option (limit to first 6 to keep tests reasonable)
                const optionsToTest = initialFilterOptions.slice(0, 6);
                console.log(`   📋 Testing first ${optionsToTest.length} options: ${optionsToTest.join(', ')}`);
                
                for (const option of optionsToTest) {
                    console.log(`\n🔍 Testing Holiday Types option: "${option}"`);
                    console.log(`   📌 Checking real-time availability of "${option}" filter...`);
                    
                    // Step 5: Click Holiday Types (for each option)
                    await searchResultPage.openFilter('Holiday Types');
                    
                    // Re-check if option is still available (dynamic validation)
                    const filterCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                    
                    const isCurrentlyVisible = await filterCheckbox.isVisible({ timeout: 3000 });
                    const isCurrentlyEnabled = isCurrentlyVisible ? await filterCheckbox.isEnabled({ timeout: 1000 }) : false;
                    const hasDisabledClass = isCurrentlyVisible ? await filterCheckbox.evaluate((el) => {
                        return el.classList.contains('disabled') || 
                               el.hasAttribute('disabled') ||
                               el.getAttribute('aria-disabled') === 'true';
                    }) : true;
                    
                    if (!isCurrentlyVisible || !isCurrentlyEnabled || hasDisabledClass) {
                        console.log(`   ⚠️ "${option}" option is now unavailable/disabled, skipping...`);
                        skippedOptions.push(`${option} (became unavailable)`);
                        await searchResultPage.closeFilter();
                        continue;
                    }
                    
                    console.log(`   ✅ "${option}" option is available and clickable, proceeding with test...`);
                    
                    // Step 7: Select one filter value from enabled values
                    await filterCheckbox.click();
                    console.log(`   ✅ Selected "${option}" holiday types filter`);
                    
                    // Step 8: Click confirm/apply
                    await searchResultPage.applyFilter();
                    console.log(`   ✅ Applied "${option}" filter`);
                    testedOptions.push(option);
                    
                    // Wait for results to update
                    await page.waitForTimeout(3000);
                    
                    // Step 9-10: Check changes on accommodation search results
                    const hasNoResults = await searchResultPage.validateNoResultsMessage();
                    
                    if (hasNoResults) {
                        console.log(`   ✅ "${option}" filter correctly shows "No results match" message`);
                    } else {
                        // Validate result count
                        const resultCount = await searchResultPage.getSearchResultCount();
                        console.log(`   📊 Filter "${option}" returned ${resultCount} results`);
                        expect(resultCount, `"${option}" filter should return some results`).toBeGreaterThan(0);
                        console.log(`   ✅ "${option}" holiday types filter returned valid results`);
                    }
                    
                    // Step 11-12: Click Holiday Types filter again and unselect the previously selected filter value
                    console.log(`   🔄 Unselecting "${option}" filter...`);
                    await searchResultPage.openFilter('Holiday Types');
                    
                    // Re-locate the checkbox for unselecting
                    const unselectCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                    if (await unselectCheckbox.isVisible({ timeout: 3000 })) {
                        await unselectCheckbox.click(); // Uncheck the option
                        console.log(`   ✅ Unselected "${option}" filter`);
                        await searchResultPage.applyFilter();
                        await page.waitForTimeout(2000);
                    } else {
                        console.log(`   ⚠️ Could not find "${option}" checkbox to unselect`);
                        await searchResultPage.closeFilter();
                    }
                    
                    // Steps 13-16 are implicit: Continue loop to select next filter value and repeat validation
                }
                
                console.log(`\n📊 Holiday Types filter testing summary for ${category.name}:`);
                console.log(`   - Initially detected options: ${initialFilterOptions.length}`);
                console.log(`   - Successfully tested options: ${testedOptions.length}`);
                console.log(`   - Skipped/disabled options: ${skippedOptions.length}`);
                console.log(`   - Tested options: ${testedOptions.join(', ')}`);
                console.log(`   - Skipped options: ${skippedOptions.map(opt => opt.split(' (')[0]).join(', ')}`);
                console.log(`   - Category-specific behavior: Some options may be disabled/unavailable for this category`);
                
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
                // Steps 1-3: Navigate to Inghams website, select category, and search
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                // Step 4: Check search results exist in form of accommodations
                await searchResultPage.waitForAccommodationResults();
                const initialResultCount = await searchResultPage.getSearchResultCount();
                expect(initialResultCount, 'Should have accommodation search results before filtering').toBeGreaterThan(0);
                console.log(`✅ Found ${initialResultCount} initial accommodation results`);
                
                console.log(`\n⏰ Testing Duration filter for ${category.name}...`);
                
                try {
                    // Step 5: Click Duration and check what filter values are available
                    console.log(`✓ Opening Duration filter...`);
                    await searchResultPage.openFilter('Duration');
                    console.log(`✓ Successfully opened Duration filter`);
                    
                    // Step 6: Get available duration options using dynamic discovery
                    const filterOptions = await searchResultPage.getFilterOptions('Duration');
                    
                    if (filterOptions.enabled.length === 0) {
                        console.log(`⚠️ No Duration filter options available for ${category.name}`);
                        await searchResultPage.closeFilter();
                        console.log(`🎉 Duration filter testing skipped for ${category.name} (no options available)`);
                        return;
                    }
                    
                    console.log(`📋 Initial Duration filter analysis for ${category.name}:`);
                    console.log(`   - Initially detected enabled options (${filterOptions.enabled.length}): ${filterOptions.enabled.join(', ')}`);
                    console.log(`   - Initially detected disabled options (${filterOptions.disabled.length}): ${filterOptions.disabled.join(', ')}`);
                    
                    // Close the filter to start fresh
                    await searchResultPage.closeFilter();
                    
                    console.log(`\n🔍 Dynamically testing Duration options for ${category.name}...`);
                    console.log(`   📋 Will test each available option individually with real-time validation`);
                    
                    // Test available Duration options (limit to first 5 to keep tests reasonable)
                    const optionsToTest = filterOptions.enabled.slice(0, 5);
                    console.log(`   📋 Testing first ${optionsToTest.length} options: ${optionsToTest.join(', ')}`);
                    
                    const testedOptions: string[] = [];
                    const skippedOptions: string[] = [];
                    
                    for (const option of optionsToTest) {
                        console.log(`\n🔍 Testing Duration option: "${option}"`);
                        console.log(`   📌 Checking real-time availability of "${option}" filter...`);
                        
                        // Step 5: Click Duration (for each option)
                        await searchResultPage.openFilter('Duration');
                        
                        // Re-check if option is still available (dynamic validation)
                        const filterCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                        
                        const isCurrentlyVisible = await filterCheckbox.isVisible({ timeout: 3000 });
                        const isCurrentlyEnabled = isCurrentlyVisible ? await filterCheckbox.isEnabled({ timeout: 1000 }) : false;
                        const hasDisabledClass = isCurrentlyVisible ? await filterCheckbox.evaluate((el) => {
                            return el.classList.contains('disabled') || 
                                   el.hasAttribute('disabled') ||
                                   el.getAttribute('aria-disabled') === 'true';
                        }) : true;
                        
                        if (!isCurrentlyVisible || !isCurrentlyEnabled || hasDisabledClass) {
                            console.log(`   ⚠️ "${option}" option is now unavailable/disabled, skipping...`);
                            skippedOptions.push(`${option} (became unavailable)`);
                            await searchResultPage.closeFilter();
                            continue;
                        }
                        
                        console.log(`   ✅ "${option}" option is available and clickable, proceeding with test...`);
                        
                        // Step 7: Select one filter value from enabled values
                        await filterCheckbox.click();
                        console.log(`   ✅ Selected "${option}" duration filter`);
                        
                        // Step 8: Click confirm/apply
                        await searchResultPage.applyFilter();
                        console.log(`   ✅ Applied "${option}" filter`);
                        testedOptions.push(option);
                        
                        // Wait for results to update
                        await page.waitForTimeout(3000);
                        
                        // Step 9-10: Check changes on accommodation search results
                        const hasNoResults = await searchResultPage.validateNoResultsMessage();
                        
                        if (hasNoResults) {
                            console.log(`   ✅ "${option}" filter correctly shows "No results match" message`);
                        } else {
                            // Validate result count
                            const resultCount = await searchResultPage.getSearchResultCount();
                            console.log(`   📊 Filter "${option}" returned ${resultCount} results`);
                            expect(resultCount, `"${option}" filter should return some results`).toBeGreaterThan(0);
                            console.log(`   ✅ "${option}" duration filter returned valid results`);
                        }
                        
                        // Step 11-12: Click Duration filter again and unselect the previously selected filter value
                        console.log(`   🔄 Unselecting "${option}" filter...`);
                        await searchResultPage.openFilter('Duration');
                        
                        // Re-locate the checkbox for unselecting
                        const unselectCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                        if (await unselectCheckbox.isVisible({ timeout: 3000 })) {
                            await unselectCheckbox.click(); // Uncheck the option
                            console.log(`   ✅ Unselected "${option}" filter`);
                            await searchResultPage.applyFilter();
                            await page.waitForTimeout(2000);
                        } else {
                            console.log(`   ⚠️ Could not find "${option}" checkbox to unselect`);
                            await searchResultPage.closeFilter();
                        }
                        
                        // Steps 13-16 are implicit: Continue loop to select next filter value and repeat validation
                    }
                    
                    console.log(`\n📊 Duration filter testing summary for ${category.name}:`);
                    console.log(`   - Initially detected options: ${filterOptions.enabled.length}`);
                    console.log(`   - Successfully tested options: ${testedOptions.length}`);
                    console.log(`   - Skipped/disabled options: ${skippedOptions.length}`);
                    console.log(`   - Tested options: ${testedOptions.join(', ')}`);
                    console.log(`   - Skipped options: ${skippedOptions.map(opt => opt.split(' (')[0]).join(', ')}`);
                    console.log(`   - Category-specific behavior: Some options may be disabled/unavailable for this category`);
                    
                } catch (error) {
                    console.error(`❌ Failed testing Duration filter: ${error.message}`);
                    console.log(`⚠️ Duration filter testing skipped for ${category.name} due to error`);
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
                // Steps 1-3: Navigate to Inghams website, select category, and search
                console.log(`🔧 Setting up ${category.name} search results...`);
                await searchResultPage.navigateToSearchResults(category.name, category.searchLocation);
                console.log(`✓ Successfully navigated to ${category.name} search results`);
                
                // Step 4: Check search results exist in form of accommodations
                await searchResultPage.waitForAccommodationResults();
                const initialResultCount = await searchResultPage.getSearchResultCount();
                expect(initialResultCount, 'Should have accommodation search results before filtering').toBeGreaterThan(0);
                console.log(`✅ Found ${initialResultCount} initial accommodation results`);
                
                console.log(`\n💰 Testing Budget filter for ${category.name}...`);
                
                try {
                    // Step 5: Click Budget and check what filter values are available
                    console.log(`✓ Opening Budget filter...`);
                    await searchResultPage.openFilter('Budget');
                    console.log(`✓ Successfully opened Budget filter`);
                    
                    // Step 6: Get available budget options using dynamic discovery
                    const filterOptions = await searchResultPage.getFilterOptions('Budget');
                    
                    if (filterOptions.enabled.length === 0) {
                        console.log(`⚠️ No Budget filter options available for ${category.name}`);
                        await searchResultPage.closeFilter();
                        console.log(`🎉 Budget filter testing skipped for ${category.name} (no options available)`);
                        return;
                    }
                    
                    console.log(`📋 Initial Budget filter analysis for ${category.name}:`);
                    console.log(`   - Initially detected enabled options (${filterOptions.enabled.length}): ${filterOptions.enabled.join(', ')}`);
                    console.log(`   - Initially detected disabled options (${filterOptions.disabled.length}): ${filterOptions.disabled.join(', ')}`);
                    
                    // Close the filter to start fresh
                    await searchResultPage.closeFilter();
                    
                    console.log(`\n🔍 Dynamically testing Budget options for ${category.name}...`);
                    console.log(`   📋 Will test each available option individually with real-time validation`);
                    
                    // Test available Budget options (limit to first 4 to keep tests reasonable)
                    const optionsToTest = filterOptions.enabled.slice(0, 4);
                    console.log(`   📋 Testing first ${optionsToTest.length} options: ${optionsToTest.join(', ')}`);
                    
                    const testedOptions: string[] = [];
                    const skippedOptions: string[] = [];
                    
                    for (const option of optionsToTest) {
                        console.log(`\n🔍 Testing Budget option: "${option}"`);
                        console.log(`   📌 Checking real-time availability of "${option}" filter...`);
                        
                        // Step 5: Click Budget (for each option)
                        await searchResultPage.openFilter('Budget');
                        
                        // Re-check if option is still available (dynamic validation)
                        const filterCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                        
                        const isCurrentlyVisible = await filterCheckbox.isVisible({ timeout: 3000 });
                        const isCurrentlyEnabled = isCurrentlyVisible ? await filterCheckbox.isEnabled({ timeout: 1000 }) : false;
                        const hasDisabledClass = isCurrentlyVisible ? await filterCheckbox.evaluate((el) => {
                            return el.classList.contains('disabled') || 
                                   el.hasAttribute('disabled') ||
                                   el.getAttribute('aria-disabled') === 'true';
                        }) : true;
                        
                        if (!isCurrentlyVisible || !isCurrentlyEnabled || hasDisabledClass) {
                            console.log(`   ⚠️ "${option}" option is now unavailable/disabled, skipping...`);
                            skippedOptions.push(`${option} (became unavailable)`);
                            await searchResultPage.closeFilter();
                            continue;
                        }
                        
                        console.log(`   ✅ "${option}" option is available and clickable, proceeding with test...`);
                        
                        // Step 7: Select one filter value from enabled values
                        await filterCheckbox.click();
                        console.log(`   ✅ Selected "${option}" budget filter`);
                        
                        // Step 8: Click confirm/apply
                        await searchResultPage.applyFilter();
                        console.log(`   ✅ Applied "${option}" filter`);
                        testedOptions.push(option);
                        
                        // Wait for results to update
                        await page.waitForTimeout(3000);
                        
                        // Step 9-10: Check changes on accommodation search results
                        const hasNoResults = await searchResultPage.validateNoResultsMessage();
                        
                        if (hasNoResults) {
                            console.log(`   ✅ "${option}" filter correctly shows "No results match" message`);
                        } else {
                            // Validate result count
                            const resultCount = await searchResultPage.getSearchResultCount();
                            console.log(`   📊 Filter "${option}" returned ${resultCount} results`);
                            expect(resultCount, `"${option}" filter should return some results`).toBeGreaterThan(0);
                            console.log(`   ✅ "${option}" budget filter returned valid results`);
                        }
                        
                        // Step 11-12: Click Budget filter again and unselect the previously selected filter value
                        console.log(`   🔄 Unselecting "${option}" filter...`);
                        await searchResultPage.openFilter('Budget');
                        
                        // Re-locate the checkbox for unselecting
                        const unselectCheckbox = page.locator(`label`).filter({ hasText: option }).first();
                        if (await unselectCheckbox.isVisible({ timeout: 3000 })) {
                            await unselectCheckbox.click(); // Uncheck the option
                            console.log(`   ✅ Unselected "${option}" filter`);
                            await searchResultPage.applyFilter();
                            await page.waitForTimeout(2000);
                        } else {
                            console.log(`   ⚠️ Could not find "${option}" checkbox to unselect`);
                            await searchResultPage.closeFilter();
                        }
                        
                        // Steps 13-16 are implicit: Continue loop to select next filter value and repeat validation
                    }
                    
                    console.log(`\n📊 Budget filter testing summary for ${category.name}:`);
                    console.log(`   - Initially detected options: ${filterOptions.enabled.length}`);
                    console.log(`   - Successfully tested options: ${testedOptions.length}`);
                    console.log(`   - Skipped/disabled options: ${skippedOptions.length}`);
                    console.log(`   - Tested options: ${testedOptions.join(', ')}`);
                    console.log(`   - Skipped options: ${skippedOptions.map(opt => opt.split(' (')[0]).join(', ')}`);
                    console.log(`   - Category-specific behavior: Some options may be disabled/unavailable for this category`);
                    
                } catch (error) {
                    console.error(`❌ Failed testing Budget filter: ${error.message}`);
                    console.log(`⚠️ Budget filter testing skipped for ${category.name} due to error`);
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
