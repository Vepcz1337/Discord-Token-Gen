/*
    Discord Token Generator
    Made by Dollar3795

    Commercial use is not permitted

    https://guildplus.xyz/?c=537
    https://t.me/DollarNoob
    https://t.me/distkn
*/

console.log("")
console.log("███╗░░░███╗░█████╗░██████╗░██╗  ███╗░░░███╗██╗██╗░░░██╗░█████╗░██╗░░██╗░█████╗░")
console.log("████╗░████║██╔══██╗██╔══██╗██║  ████╗░████║██║╚██╗░██╔╝██╔══██╗██║░██╔╝██╔══██╗")
console.log("██╔████╔██║██║░░██║██████╔╝██║  ██╔████╔██║██║░╚████╔╝░███████║█████═╝░██║░░██║")
console.log("██║╚██╔╝██║██║░░██║██╔══██╗██║  ██║╚██╔╝██║██║░░╚██╔╝░░██╔══██║██╔═██╗░██║░░██║")
console.log("██║░╚═╝░██║╚█████╔╝██║░░██║██║  ██║░╚═╝░██║██║░░░██║░░░██║░░██║██║░╚██╗╚█████╔╝")
console.log("╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚═╝╚═╝  ╚═╝░░░░░╚═╝╚═╝░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░\n")
console.log("•——————————————————————————————•°•✿•°•——————————————————————————————•\n")

const {default: axios} = require("axios");
const fs = require("fs");
const playwright = require("playwright");

(async  function() {
    while (true) {
        await sleep(await GenerateToken("Proxyless"));
    }
})();

function GenerateToken(Proxy) {
    return new Promise(async function(resolve) {
        console.log("[STARTED] " + Proxy);
        const PBrowser = await playwright.firefox.launch({headless: false});
        const PContext = await PBrowser.newContext();
        const PPage = await PContext.newPage();
        var startTime = Date.now();
        try {
            try {
                await PPage.goto("https://discord.com/", {"timeout": 60000, "waitUntil": "networkidle"});
                console.log("[WORKING] " + Proxy);
            }
            catch {
                console.log("[BAD] " + Proxy);
                throw false;
            }
            await PPage.click("#app-mount > div > div > div.grid-3Ykf_K.heroBackground-3m0TRU > div.row-3wW-Fx.heroContainer-3j1eQg > div > div.ctaContainer-3vWJHU > button");
            await sleep(1000);
            await PPage.type("input.username-27KRPU", Math.random().toString(36).substring(2, 7) + " | Mori\n");
            await PPage.waitForSelector("iframe");
            console.log("[CAPTCHA DETECTED] " + Proxy);
            startTime = Date.now();
            await sleep(3000);
            await PPage.click("iframe");
            var email = Math.random().toString(36).substring(2, 12);
            await axios.post("https://api.internal.temp-mail.io/api/v3/email/new", {"domain": "unigeol.com", "name": email});
            email += "@unigeol.com";
            await sleep(1000);
            await PPage.waitForSelector("#react-select-2-input");
            console.log("[CAPTCHA SOLVED] " + Proxy);
            await PPage.type("#react-select-2-input", "January\n");
            await PPage.type("#react-select-3-input", "1\n");
            await PPage.type("#react-select-4-input", "2000\n\n");
            await PPage.waitForSelector("button.close-hZ94c6");
            await PPage.click("button.close-hZ94c6");
            await sleep(1000);
            await PPage.waitForSelector("input[type='text']");
            await PPage.type("input[type='text']", email);
            await PPage.type("input[type='password']", "MoriPass579\n");
            console.log("[EMAIL ADDED] " + Proxy);
            var emailData;
            while (true) {
                var emailData = await axios.get("https://api.internal.temp-mail.io/api/v3/email/" + email + "/messages").then(res => res.data);
                if (emailData.length !== 0) {
                    emailData = emailData[0].body_text.split("Verify Email: ")[1].trim();
                    break;
                }
                await sleep(1000);
            }
            console.log("[EMAIL RECEIVED] " + Proxy);
            await PPage.goto(emailData);
            await PPage.waitForSelector("h3.title-jXR8lp");
            while (await PPage.innerText("h3.title-jXR8lp") !== "Email Verified!") {
                try {
                    await PPage.waitForSelector("iframe", {"timeout": 3000});
                    await PPage.click("iframe");
                }
                catch {}
                await sleep(1000);
            }
            console.log("[EMAIL VERIFIED] " + Proxy);
            var Token = await PPage.evaluate(function() {
                var iframe = document.createElement("iframe");
                document.head.append(iframe);
                return iframe.contentWindow.localStorage.getItem("token").replace(/"/g, "");
            });
            fs.appendFileSync("./Tokens.txt", email + ":MoriPass579:" + Token + "\n");
            console.log("[TOKEN SAVED] " + Buffer.from(Token.split(".")[0], "base64").toString() + " | " + Proxy);
            await PBrowser.close();
            console.log("[FINISHED] " + Proxy);
        }
        catch {
            console.error("[ERROR] " + Proxy);
            await PBrowser.close();
        }
        resolve(startTime + 150000 - Date.now());
    });
}

function sleep(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}