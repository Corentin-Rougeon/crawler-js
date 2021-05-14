const puppeteer = require('puppeteer')
const fs = require('fs')
let games = []

void (async () => {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://www.goclecd.fr/acheter-cod-black-ops-cold-war-cle-cd-comparateur-prix/')
        const collectData = await page.evaluate(() => {
            const grabData = (row, target) => row
                .querySelector(`div.${target}`)

            const DEALER_ROW = 'div.offers-table-row'

            const data = []

            const dealRow = document.querySelectorAll(DEALER_ROW)

            for (const mark of dealRow){
                data.push({
                    name: grabData(mark, 'offers-merchant'),
                    price: grabData(mark, 'x-offer-price')
                })
            }
            return data
        })
        console.log(JSON.stringify(collectData, null, 2))
        await browser.close()
        /*const jsonResult = JSON.stringify(collectData, null, 2)
        await fs.promises.writeFile('result.json', jsonResult)*/
    } catch (error) {
        console.log(error)
    }
})()
