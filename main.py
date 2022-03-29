import requests
import os
import random
import time
from mails import GetDiscordEmail, GetEmail
from playwright.sync_api import sync_playwright

genned = 0
captcha = 0
failed = 0

class data:
    def name():
        r=requests.get('https://story-shack-cdn-v2.glitch.me/generators/username-generator?')
        return r.json()["data"]["name"]
    def get_email(cookie):
        while True:
            time.sleep(1)
            email = str(GetEmail(cookie))
            email_strip = email.split("@")[1]
            if email_strip == "tempmail.dev":
                a=1
            else:
                return email

def gen():
    global genned, captcha, failed
    username = data.name()
    password = "alexisveryhotlol"
    pt1 = requests.get("https://tempmail.dev/").headers["set-cookie"]
    cookie = pt1.strip("PHPSESSID=; path=/")
    mail = data.get_email(cookie)
    proxy = random.choice(open("proxies.txt","r").read().splitlines())
    with sync_playwright() as p:
        for browser_type in [p.firefox]:
            browser = browser_type.launch(headless=False,proxy={"server": f'http://{proxy}'})
            sex = browser.new_context()
            page = sex.new_page()
            try:
                page.goto('https://discord.com/register')
                time.sleep(1)
                page.type("#app-mount > div.app-3xd6d0 > div > div > div > form > div > div > div:nth-child(1) > div > input", mail)
                time.sleep(.3)
                page.type("#app-mount > div.app-3xd6d0 > div > div > div > form > div > div > div:nth-child(2) > div > input", username)
                time.sleep(.3)
                page.type("#app-mount > div.app-3xd6d0 > div > div > div > form > div > div > div:nth-child(3) > div > input", password)
                page.type("#react-select-2-input", "January\n")
                time.sleep(.3)
                page.type("#react-select-3-input", "1\n")
                time.sleep(.3)
                page.type("#react-select-4-input", "2000\n\n")
                page.wait_for_selector("iframe")
                time.sleep(3)
                page.click("iframe")
                time.sleep(5)
                try:
                    token = page.evaluate("""
                    (_ => {
                    const win = window.open();
                    const token = win.localStorage.token;
                    win.close();
                    return token;
                    })();
                    """)
                except:
                    print("failed to gen the token")
                time.sleep(6)
                takes = 0
                while True:
                    verifyy = GetDiscordEmail(cookie)
                    if str(verifyy) == "[]":
                        takes +=1
                        print(f"getting email {takes}")
                        if takes == 100:
                            return print("failed to get email")
                        time.sleep(1)
                    else:
                        link = verifyy
                        break
                print(verifyy)
                page.goto(link, wait_until="load")
                time.sleep(3)
                try:
                    page.click("iframe")
                except:
                    pass
                token2 = str(token)
                token3 = token2.replace('"',"")
                file = open("accounts.txt","a")
                file.write(f"{token3}:{mail}:{username}:{password}\n")
                genned += 1
                print(f"done {genned}")
                page.close()
            except Exception as e:
                print(e)
while 1:
    gen()