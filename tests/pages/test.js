class Sample{
    constructor (page){
        this.page=page
        this.segment=page.locator('.mb-1')
        this.orign=page.locator('[title="Leaving From"]')
        this.OriginSearch=page.locator('[placeholder="Search Destination"]')
        this.Destination=page.locator('[title="Going To"]')
        this.destinationSearch = page.locator('[placeholder="Search Destination"]')
        this.Triptype = page.locator('.trip-type-select-width')
    }
    async triptype(data){
        await this.Triptype.click()
        await this.page.waitForTimeout(1000)
        await this.page.locator(`li[data-value="${data.triptype}"]`).click(); 
    }
    async  search(data){
       for(let i=0;i<6;i++){
        if(await this.segment.nth(i).isVisible()){
            try {
                await this.page.waitForTimeout(2000)
                await this.orign.click();
                await this.page.waitForTimeout(2000)
                await this.OriginSearch.nth(i).fill(data.org1);
                await this.page.waitForTimeout(2000)
                await this.page.waitForSelector(`div.destination-code:has-text("${data.org1}")`);
                await this.page.waitForTimeout(1000)
                await this.page.locator(`div.destination-code:has-text("${data.org1}")`).click();
                await this.page.waitForTimeout(1000)
                await this.Destination.click();
                await this.page.waitForTimeout(1000)
                await this.destinationSearch.nth(i+1).fill(data.Des1);
                await this.page.waitForTimeout(1000)
                await this.page.waitForSelector(`div.destination-code:has-text("${data.Des1}")`);
                await this.page.waitForTimeout(1000)
                await this.page.locator(`div.destination-code:has-text("${data.Des1}")`).click();
                await this.page.waitForTimeout(2000)
                // await this.triptype(data)
                // await this.page.waitForTimeout(2000)
                break; 
            } catch (error) {
                console.error(`Error processing segment ${i}:`, error);
            }
        }
       }
    }
}
export default Sample;