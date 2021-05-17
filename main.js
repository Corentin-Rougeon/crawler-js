const puppeteer = require('puppeteer')
const fs = require('fs')

//let game = prompt('Enter your game : ');
let game = 'titanfall 2'

void (async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.goclecd.fr/');
        await page.waitForTimeout(1000);
        await page.click('.banner-search-form');
        await page.waitForTimeout(1000);
        await page.type('input.banner-search-form-input', game);
        await page.waitForTimeout(1000);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await page.click('.search-results-row-link');
        await page.waitForTimeout(1000);
        await page.click('#reveal_all_offers')
        await page.waitForTimeout(500)

        const collectData = await page.evaluate(() => {
            const grabData = (row, target) => row.querySelector(`.${target}`).innerText
            const grabLink = (row, target) => row.querySelector(`.${target}`).href
            const grabIDdata = (row, target) => row.querySelector(`#${target}`).innerText
            const grabPlatform = (row, target) => row.querySelector(`#${target}`).className.split("-")[2]
            const grabRating = (row, target) => Math.round((parseInt(row.querySelector(`#${target}`).style.width.slice(0,-2))/60)*100)
            const DEALER_ROW = 'div.offers-table-row'
            const data = []
            const dealRow = document.querySelectorAll(DEALER_ROW)
            for (const mark of dealRow){
                data.push({
                    name: grabData(mark, 'offers-merchant-name'),
                    price: grabData(mark, 'x-offer-price'),
                    link: grabLink(mark,"x-offer-buy-btn"),
                    rating: grabRating(mark,"offer_merchant_rating"),
                    platform: grabPlatform(mark,"offer_platform_logo"),
                    type: grabIDdata(mark,"offer_region_name"),
                    edition: grabIDdata(mark,"offer_edition_name")
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