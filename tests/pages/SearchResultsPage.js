import { expect } from '@playwright/test';
import Searchapi from '../pages/SearchAPI.js';
class SearchResultPage {
    constructor(page, request) {
        this.page = page
        this.request = request
    }
    async SearchResults(data) {
        console.log(data)
        await this.APIresponse(data)
        await this.ValidateUI(data)

    }
    async APIresponse(data) {
        const APIsearch = new Searchapi(this.request)
        const apires = await APIsearch.SearchApiResponse(data)
        console.log(`this is api  ${apires.traceId}`)
        return apires;
    }
    async ValidateUI(data) {
        const apires = await this.APIresponse(data)
        await this.searching()
        const ItineraryContainer = await this.page.locator('#itinerary_container').count()
        console.log(ItineraryContainer)
        let j = 0;
        for (let i = 0; i < ItineraryContainer; i++) {
            console.log("enters the for lopp of validate UI")
            const Airline = apires.flights[i].airline
            const UIAirlineText = await this.page.locator('.airline_details').nth(i).textContent();
            const UIAirline = UIAirlineText.split('|').map(item => item.trim());
            console.log(UIAirline[0])
            console.log(`airline ${Airline}, UIAirlineText ${UIAirlineText}`)
            expect(UIAirline[0]).toBe(Airline)
            await this.page.locator('text="Flight Details"').nth(i).click()
            const UIOriginText = await this.page.locator('.flt-origin').nth(i).textContent();
            const UIDestinationText=await this.page.locator('.flt-destination').nth(i).textContent();
            expect(UIOriginText.trim()).toBe(apires.flights[i].segGroups[0].origin);
            expect(UIDestinationText.trim()).toBe(apires.flights[i].segGroups[0].destination)
            console.log("origin checked")
            const Fnum =await this.page.locator('div.col-8 .flt-number').nth(i).textContent();
            const flightNum=Fnum.split("-").map(item=>item.trim())
            expect(flightNum[1]).toBe(apires.flights[i].segGroups[0].segs[0].flightNum)
            const eachSegment=await this.page.locator('.flt-bkg-information-panel').count()
            console.log(eachSegment)
            let depterminalText,ariterminalText,depterminalNumber,ariterminalNumber;
            for(let x = 0 ;x < eachSegment  ; x++)
            {
            depterminalText = await this.page.locator('.flt-airport-nm').nth(j).textContent();
            ariterminalText = await this.page.locator('.flt-airport-nm').nth(j++).textContent();
            depterminalNumber = depterminalText.match(/Terminal\s(\d+)/)[1];
            ariterminalNumber = ariterminalText.match(/Terminal\s(\d+)/)[1];
            //console.log("flight NUM checked")
            expect(depterminalNumber).toBe(apires.flights[i].segGroups[0].segs[0].depTerminal)
            expect(ariterminalNumber).toBe(apires.flights[i].segGroups[0].segs[0].arrTerminal)
            console.log("One segment checked")
        }

        }
    }
    async searching() {
        await this.page.locator('text="Search"').click()
        await expect(this.page.locator('.loader-box-content')).toBeVisible()
        await this.page.waitForSelector('.loader-box-content', { state: 'hidden', timeout: 180000 });
        // await this.page.click('.nav-item-text:has-text("Flights")')
        //     await this.page.evaluate(() => localStorage.removeItem('lastSearch'));
        //     await this.page.reload();
    }

}
export default SearchResultPage;