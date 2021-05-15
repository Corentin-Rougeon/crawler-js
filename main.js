const puppeteer = require('puppeteer')
const fs = require('fs')

void (async () => {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://www.goclecd.fr/acheter-cod-black-ops-cold-war-cle-cd-comparateur-prix/')
        /*
        await page.waitForSelector('div form div:nth-child(2) input');
        await page.click('div form div:nth-child(2) input');
        await page.keyboard.type(key_words);
        await page.keyboard.press('Enter');
         */
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
