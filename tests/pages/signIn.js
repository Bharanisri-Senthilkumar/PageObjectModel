class Signin {
    constructor(page, request) {
        this.page = page;
        this.request = request;
        this.uname = page.locator('[placeholder="Enter Username"]');
        this.pword = page.locator('[placeholder="Enter Password"]');
        this.login = page.locator('text="Log In"');
        this.loader = page.locator('.loader-box-content');
        this.otpLocators = page.locator('.otp-input');
        //  this.triptype=page.locator('.MuiSelect-root.MuiSelect-select.MuiSelect-selectMenu.MuiInputBase-input.MuiInput-input:has-text("One Way")')
    }
    async navigatetopage() {
        await this.page.goto('https://uat.getfares.com/SignIn', { timeout: 600000, waitUntil: 'load' });
        console.log("Page Navigated");
    }
    async logincredentials(username, password) {
        await this.uname.fill(username);
        console.log("Username entered", username);
        await this.pword.fill(password);
        console.log("Password Entered", password);
        await this.login.click();
        console.log("Login button clicked");
    }
    async otpfunction() {
        console.log("Entering otp function")
        const otpPopUp = await this.page.waitForSelector('.otp-main-container', { timeout: 10000 }).then(() => true).catch(() => false);
        if (otpPopUp) {
            console.log("OTP pop-up shown.");
            const email = 'userrani@yopmail.com';
            let otpResponse;
            try {
                otpResponse = await this.request.get(`https://sandbox.getfares.com/api/Configuration/EmailVerification/GetOTPByEmail?EmailId=${email}`);
            } catch (error) {
                console.error("Failed to fetch OTP:", error);
                return;
            }
            const responsedata = await otpResponse.json();
            const otpDigits = responsedata.otp.toString().split('');
            for (let i = 0; i < otpDigits.length; i++) {
                await this.otpLocators.nth(i).fill(otpDigits[i]);
            }
            console.log("OTP entered");
            await this.page.getByRole('button', { name: 'Submit OTP' }).click();
        } else {
            console.log("OTP not required.");
        }
    }

}
export default Signin;
