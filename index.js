const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.get('/', (req, res) => {
    console.log('here');
    return res.json({
        success: true,
        message: "working"
    });
});

app.get('/:city', async (req, res) => {
    console.log('here');
    let city = req.param.city;
    console.log(city);
    let categories = await getCats(city);
    return res.json({
        categories: categories
    });
});

async function getCats(city) {
    let res = await axios.get(`https://www.tripadvisor.in/Attractions-g304554-Activities-${city}.html`);
    res = res.data.toString();
    //console.log(res);

    fullBody = res;

    let startTagQuote = fullBody.split('<div class="attractions-carousel-shelf-ShelfCarouselItem__text--1D7iD">');
    let endTagQuote = startTagQuote.toString().split('</div></div></div></div></div>');

    //console.log(endTagQuote);

    let categories = [];

    for (let i = 0; i < endTagQuote.length; i++) {
        let extractedNoun = endTagQuote[i].split('--18nNN">,')[1];
        categories.push(extractedNoun);
    }

    let filtered = categories.filter(function (el) {
        return el != null;
    });

    return filtered;
}

require('./route')(app);

app.listen(3001);
console.log('listening on port');