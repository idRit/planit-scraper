module.exports = (app) => {
    const fetch = require('node-fetch');
    app.get('/api/getRandomCountry', async (req, res) => {
        return res.json({
            success: true,
            text: await getRandomCity()
        });
    });

    app.get('/api/getCityDetails/:country', async (req, res) => {
        return res.json({
            sucess: true,
            details: await getCityDetails(req.params.country)
        });
    });

    async function getRandomCity() {
        let res = await (await fetch('https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json')).json();

        let randomNumber = Math.floor(Math.random() * res.length - 1);

        res = res[randomNumber]

        console.log(res);
        return res;
    }

    async function getCityDetails(country) {
        const cheerio = require('cheerio')
        let res = await (await fetch(`https://wikitravel.org/en/${country}`)).text();

        let fullBody = res;

        let startTagQuote = fullBody.split('<div id="quickbar" style="float: right; margin: 0 0 1em 1em">')[1];
        let endTagQuote = startTagQuote.split('</div>')[0];

        const $ = cheerio.load(endTagQuote);

        let x = $('tr').text().split('\n');
        
        x = x.filter(val => val !== '').map(el => el.trim());
        
        x.forEach((el, i) => {
            if (el === "Quick Facts") {
                x.splice(0, i+1);
            }
        });

        x.forEach((el, i) => {
            if (i % 2 === 0) {
                el.replace(/ +/g, "")
            }
        });

        console.log(x);

        let details = {}

        for (let i = 0; i < x.length / 2; i += 2 ) {
            details[x[i]] = x[i+1];
        }

        console.log(details);

        return details;
    }

}