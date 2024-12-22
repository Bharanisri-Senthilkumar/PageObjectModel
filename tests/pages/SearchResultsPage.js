import {expect} from '@playwright/test'
class SearchResultPage{
    constructor(page){
        this.page=page
    }
    async SearchResults(){
        await this.page.locator('text="Search"').click()
        await expect(this.page.locator('.loader-box-content')).toBeVisible()
        await this.page.waitForSelector('.loader-box-content', { state: 'hidden', timeout: 180000 });
        await this.page.click('.nav-item-text:has-text("Flights")')
            await this.page.evaluate(() => localStorage.removeItem('lastSearch'));
            await this.page.reload();
    }

}
export default SearchResultPage;