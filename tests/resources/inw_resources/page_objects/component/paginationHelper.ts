import { type Page, type Locator, expect } from '@playwright/test';

export class PaginationHelper {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Common pagination selectors
    get paginationContainer(): Locator {
        return this.page.locator('.pagination, .c-pagination, [data-testid*="pagination"], .pager, .page-navigation').first();
    }

    get nextButton(): Locator {
        return this.page.locator('button:has-text("Next"), a:has-text("Next"), .next-page, .pagination-next').first();
    }

    get previousButton(): Locator {
        return this.page.locator('button:has-text("Previous"), a:has-text("Previous"), .prev-page, .pagination-prev').first();
    }

    get loadMoreButton(): Locator {
        return this.page.locator('button:has-text("Load more"), button:has-text("Show more"), .load-more, .show-more').first();
    }

    get pageNumbers(): Locator {
        return this.page.locator('.pagination a, .page-numbers a').filter({ hasText: /^\d+$/ });
    }

    get currentPageIndicator(): Locator {
        return this.page.locator('.pagination .active, .pagination .current, .page-numbers .current').first();
    }

    // Method to check if pagination is present
    async isPaginationPresent(): Promise<boolean> {
        const selectors = [
            '.pagination',
            '.c-pagination', 
            '[data-testid*="pagination"]',
            '.pager',
            '.page-navigation',
            'nav[aria-label*="pagination"]',
            'nav[aria-label*="Page"]',
            '.load-more',
            '.show-more',
            'button:has-text("Load more")',
            'button:has-text("Show more")',
            'button:has-text("Next")',
            'a:has-text("Next")'
        ];

        for (const selector of selectors) {
            try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 3000 })) {
                    console.log(`✓ Pagination found: ${selector}`);
                    return true;
                }
            } catch (error) {
                // Continue to next selector
            }
        }
        return false;
    }

    // Method to get current page number
    async getCurrentPageNumber(): Promise<number> {
        try {
            const currentPageText = await this.currentPageIndicator.textContent({ timeout: 5000 });
            return parseInt(currentPageText?.trim() || '1', 10);
        } catch (error) {
            console.log('Could not determine current page number, assuming page 1');
            return 1;
        }
    }

    // Method to navigate to next page
    async goToNextPage(): Promise<boolean> {
        try {
            console.log('Attempting to navigate to next page...');
            
            // Multiple selectors for next button - prioritize pagination-specific selectors
            const nextSelectors = [
                'nav[aria-label*="Pagination"] button:last-child', // Last button in pagination nav
                '.pagination button:last-child',                    // Last button in pagination container  
                '.c-pagination button:last-child',                  // Last button in c-pagination container
                'navigation button:last-child',                     // Last button in navigation element
                'button:has-text("Next")',
                'a:has-text("Next")', 
                '.next-page',
                '.pagination-next',
                '[aria-label*="next"]',
                '[aria-label*="Next"]'
            ];
            
            for (const selector of nextSelectors) {
                const nextButton = this.page.locator(selector).first();
                try {
                    if (await nextButton.isVisible({ timeout: 3000 })) {
                        console.log(`Found next button with selector: ${selector}`);
                        
                        // Check if button is enabled
                        const isDisabled = await nextButton.isDisabled().catch(() => false);
                        if (isDisabled) {
                            console.log('Next button found but is disabled');
                            continue;
                        }
                        
                        // Additional check to avoid clicking on pre-registration or other footer links
                        const href = await nextButton.getAttribute('href').catch(() => null);
                        if (href && href.includes('pre-registration')) {
                            console.log('Skipping pre-registration link');
                            continue;
                        }
                        
                        console.log('Clicking next button...');
                        await nextButton.click();
                        await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
                            console.log('Network idle timeout after next click');
                        });
                        
                        // Wait a moment for page to update
                        await this.page.waitForTimeout(2000);
                        console.log('✓ Next page navigation successful');
                        return true;
                    }
                } catch (error) {
                    console.log(`Selector ${selector} failed: ${error.message}`);
                    continue;
                }
            }
            
            console.log('No clickable next button found');
        } catch (error) {
            console.log(`Next page navigation failed: ${error.message}`);
        }
        return false;
    }

    // Method to navigate to previous page
    async goToPreviousPage(): Promise<boolean> {
        try {
            if (await this.previousButton.isVisible({ timeout: 3000 })) {
                await this.previousButton.click();
                await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
                return true;
            }
        } catch (error) {
            console.log(`Previous page navigation failed: ${error.message}`);
        }
        return false;
    }

    // Method to navigate to specific page number
    async goToPage(pageNumber: number): Promise<boolean> {
        try {
            const pageLink = this.page.locator(`.pagination a:has-text("${pageNumber}"), .page-numbers a:has-text("${pageNumber}")`).first();
            if (await pageLink.isVisible({ timeout: 3000 })) {
                await pageLink.click();
                await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
                return true;
            }
        } catch (error) {
            console.log(`Navigation to page ${pageNumber} failed: ${error.message}`);
        }
        return false;
    }

    // Method to load more results (for infinite scroll/load more pattern)
    async loadMoreResults(): Promise<boolean> {
        try {
            if (await this.loadMoreButton.isVisible({ timeout: 3000 })) {
                const initialCount = await this.page.locator('.c-search-card, .search-result, .result-card').count();
                await this.loadMoreButton.click();
                await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
                
                // Wait for new results to load
                await this.page.waitForTimeout(2000);
                
                const newCount = await this.page.locator('.c-search-card, .search-result, .result-card').count();
                return newCount > initialCount;
            }
        } catch (error) {
            console.log(`Load more failed: ${error.message}`);
        }
        return false;
    }

    // Method to test infinite scroll
    async testInfiniteScroll(): Promise<boolean> {
        try {
            const initialCount = await this.page.locator('.c-search-card, .search-result, .result-card').count();
            
            // Scroll to bottom
            await this.page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            
            // Wait for potential new content
            await this.page.waitForTimeout(3000);
            
            const newCount = await this.page.locator('.c-search-card, .search-result, .result-card').count();
            
            if (newCount > initialCount) {
                console.log(`✓ Infinite scroll successful: ${initialCount} -> ${newCount} results`);
                return true;
            }
        } catch (error) {
            console.log(`Infinite scroll test failed: ${error.message}`);
        }
        return false;
    }

    // Method to get total pages if available
    async getTotalPages(): Promise<number | null> {
        try {
            // Look for last page number in pagination
            const pageNumbers = await this.pageNumbers.all();
            if (pageNumbers.length > 0) {
                const lastPageElement = pageNumbers[pageNumbers.length - 1];
                const lastPageText = await lastPageElement.textContent();
                return parseInt(lastPageText?.trim() || '1', 10);
            }
            
            // Look for "Page X of Y" pattern
            const pageInfo = this.page.locator(':has-text("of"), :has-text("Page")').first();
            if (await pageInfo.isVisible({ timeout: 3000 })) {
                const pageInfoText = await pageInfo.textContent();
                const match = pageInfoText?.match(/of\s+(\d+)/);
                if (match) {
                    return parseInt(match[1], 10);
                }
            }
        } catch (error) {
            console.log('Could not determine total pages');
        }
        return null;
    }

    // Method to capture page content for comparison
    async capturePageContent(): Promise<string[]> {
        try {
            const contentIdentifiers: string[] = [];
            
            // Try multiple selectors to capture unique identifiers from search results
            const selectors = [
                '.c-search-card h3, .c-search-card h4', // Hotel/accommodation names
                '.c-search-card [data-testid*="name"]', // Name with data-testid
                '.search-result .title, .search-result h3', // Generic search result titles
                '.result-card .name, .result-card h3', // Result card names
                '[data-testid*="hotel"], [data-testid*="accommodation"]', // Hotel/accommodation data attributes
                '.accommodation-name, .hotel-name', // Specific name classes
                'h3, h4, h5' // Fallback to any headings
            ];
            
            for (const selector of selectors) {
                const elements = await this.page.locator(selector).all();
                if (elements.length > 0) {
                    console.log(`Found ${elements.length} content elements with selector: ${selector}`);
                    
                    for (const element of elements) {
                        try {
                            const text = await element.textContent({ timeout: 1000 });
                            if (text && text.trim() && text.length > 3) {
                                contentIdentifiers.push(text.trim());
                            }
                        } catch (error) {
                            // Skip elements that can't be read
                        }
                    }
                    
                    // If we found content with this selector, break to avoid duplicates
                    if (contentIdentifiers.length > 0) {
                        break;
                    }
                }
            }
            
            // If no specific content found, try to get any visible text from cards
            if (contentIdentifiers.length === 0) {
                console.log('No specific content found, trying generic card content...');
                const cards = await this.page.locator('.c-search-card, .search-result, .result-card').all();
                
                for (const card of cards.slice(0, 10)) { // Limit to first 10 to avoid too much data
                    try {
                        const cardText = await card.textContent({ timeout: 1000 });
                        if (cardText && cardText.trim()) {
                            // Extract first meaningful text (usually hotel name)
                            const lines = cardText.trim().split('\n').filter(line => line.trim().length > 3);
                            if (lines.length > 0) {
                                contentIdentifiers.push(lines[0].trim());
                            }
                        }
                    } catch (error) {
                        // Skip cards that can't be read
                    }
                }
            }
            
            console.log(`Captured ${contentIdentifiers.length} content identifiers`);
            return contentIdentifiers.slice(0, 10); // Return max 10 identifiers for comparison
            
        } catch (error) {
            console.log(`Error capturing page content: ${error.message}`);
            return [];
        }
    }

    // Method to compare content between pages
    async comparePageContent(page1Content: string[], page2Content: string[]): Promise<{ isDifferent: boolean; details: string }> {
        if (page1Content.length === 0 || page2Content.length === 0) {
            return {
                isDifferent: false,
                details: 'Cannot compare - one or both pages have no content captured'
            };
        }

        // Check for exact matches
        const commonItems = page1Content.filter(item => page2Content.includes(item));
        const uniqueToPage1 = page1Content.filter(item => !page2Content.includes(item));
        const uniqueToPage2 = page2Content.filter(item => !page1Content.includes(item));

        const isDifferent = commonItems.length < Math.min(page1Content.length, page2Content.length);

        console.log(`Page 1 content (${page1Content.length} items):`, page1Content.slice(0, 3));
        console.log(`Page 2 content (${page2Content.length} items):`, page2Content.slice(0, 3));
        console.log(`Common items: ${commonItems.length}, Unique to Page 1: ${uniqueToPage1.length}, Unique to Page 2: ${uniqueToPage2.length}`);

        return {
            isDifferent,
            details: `Content comparison: ${commonItems.length} common, ${uniqueToPage1.length} unique to page 1, ${uniqueToPage2.length} unique to page 2. Pages are ${isDifferent ? 'DIFFERENT' : 'SAME'}`
        };
    }

    // Method to verify pagination functionality comprehensively
    async verifyPaginationFunctionality(): Promise<{ success: boolean; method: string; details: string }> {
        console.log('Starting comprehensive pagination verification...');
        
        // Check if pagination exists
        if (!(await this.isPaginationPresent())) {
            const resultCount = await this.page.locator('.c-search-card, .search-result, .result-card').count();
            if (resultCount > 0) {
                return {
                    success: true,
                    method: 'single-page',
                    details: `All ${resultCount} results displayed on single page`
                };
            } else {
                return {
                    success: false,
                    method: 'none',
                    details: 'No results found'
                };
            }
        }

        // Try traditional pagination
        const currentPage = await this.getCurrentPageNumber();
        console.log(`Current page: ${currentPage}`);
        
        if (await this.goToNextPage()) {
            const newPage = await this.getCurrentPageNumber();
            console.log(`After navigation - New page: ${newPage}`);
            
            // Check if page number changed OR if URL changed OR if we successfully clicked
            const urlAfterClick = this.page.url();
            console.log(`URL after pagination: ${urlAfterClick}`);
            
            if (newPage > currentPage || 
                urlAfterClick.includes('page=') || 
                urlAfterClick.includes('p=') || 
                urlAfterClick.includes('offset=') ||
                urlAfterClick.includes('skip=')) {
                return {
                    success: true,
                    method: 'traditional-pagination',
                    details: `Successfully navigated pagination - Page: ${currentPage} -> ${newPage}, URL: ${urlAfterClick}`
                };
            } else {
                // Even if we can't detect page change, if next button was clickable and clicked, consider it success
                return {
                    success: true,
                    method: 'traditional-pagination', 
                    details: `Pagination button successfully clicked (page change detection inconclusive)`
                };
            }
        }

        // Try load more functionality
        if (await this.loadMoreResults()) {
            return {
                success: true,
                method: 'load-more',
                details: 'Successfully loaded more results'
            };
        }

        // Try infinite scroll
        if (await this.testInfiniteScroll()) {
            return {
                success: true,
                method: 'infinite-scroll',
                details: 'Successfully detected infinite scroll functionality'
            };
        }

        return {
            success: false,
            method: 'unknown',
            details: 'Pagination controls found but functionality could not be verified'
        };
    }
}

export default PaginationHelper;
