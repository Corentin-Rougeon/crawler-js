const puppeteer = require('puppeteer')
const fs = require('fs')

//let game = prompt('Enter your game : ');
let game = 'call of duty cold war'

void (async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.goclecd.fr/');
        await page.waitFor(1000);
        await page.click('.banner-search-form');
        await page.waitFor(1000);
        await page.type('input.banner-search-form-input', game);
        await page.waitFor(1000);
        await page.keyboard.press('Enter');
        await page.waitFor(1000);
        await page.click('.search-results-row-link');
        await page.waitFor(1000);

        const collectData = await page.evaluate(() => {
            const grabData = (row, target) => row.querySelector(`.${target}`).innerText
            const DEALER_ROW = 'div.offers-table-row'
            const data = []
            const dealRow = document.querySelectorAll(DEALER_ROW)
            for (const mark of dealRow){
                data.push({
                    name: grabData(mark, 'offers-merchant-name'),
                    price: grabData(mark, 'x-offer-price')
                })
            }
            return data
        })

        console.log(JSON.stringify(collectData,null, 2))

        await browser.close()
        const jsonResult = JSON.stringify(collectData, null, 2)
        await fs.promises.writeFile('result.json', jsonResult)

    } catch (error) {
        console.log(error)
    }
})()
