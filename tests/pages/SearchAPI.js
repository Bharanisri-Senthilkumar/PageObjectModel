import SearchAPIInputData from '../Json/SearchAPIInputData.json';
import {expect} from '@playwright/test';
class Searchapi {
    constructor(request) {
        this.request = request;
    }
    async SearchApiResponse(data) {
        
        console.log("SearchAPI")
        console.log(data)
        const inputdata = {
            grant_type: 'client_credentials',
            Scope: 'FlightEngine',
            Client_id: 'clientid.automation',
            Client_secret: 'Automate@123',
        }
        const encodeData = new URLSearchParams(inputdata).toString();
        const Tokenresponse = await this.request.post('https://sandbox.getfares.com/connect/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',//mentioning how to treat the request body
            },
            data: encodeData,
        }); 
        const TokenRes = await Tokenresponse.json()
        const access_token = TokenRes.access_token
        console.log(TokenRes)
        expect(Tokenresponse.status()).toBe(200)
        for (const  senddata of SearchAPIInputData) {
            const SearchResponse = await this.request.post('https://sandbox.getfares.com/Flights/Search/v1/', {
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                data: senddata,
                timeout: 60000
            })
            expect(SearchResponse.status()).toBe(200)
            var searchResponse = await SearchResponse.json()
        }
       return searchResponse;
    }
}
export default Searchapi;