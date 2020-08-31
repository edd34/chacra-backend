const express = require('express')
const puppeteer = require('puppeteer')
const bodyParser = require("body-parser");
const cors = require("cors");

var corsOptions = {
    origin: "http://localhost:8080"
};

const app = express()
    // app.engine('html', mustacheExpress())
app.set('view engine', 'ejs')

app.use(cors(corsOptions));


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//route for test export html
app.get('/export/html', (req, res) => {
    var mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    var templateData = JSON.parse(req.query.param)
    templateData.mois = mois[templateData.month]
    console.log("req.params", templateData)
    res.render('template', templateData)
})

app.post('/export/pdf', (req, res) => {
    (async() => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        console.log("hehe", String(JSON.stringify(req.body)))
        await page.goto('http://localhost:3000/export/html?param=' + String(JSON.stringify(req.body))).then(success => console.log("success")).catch(error => console.log("error"))
        const buffer = await page.pdf({ format: 'A4', landscape: true })

        // res.setHeader('Content-Length', buffer.size);
        res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
        // console.log(buffer)
        res.send(buffer);
        browser.close()
    })()
})

// route for test live site
app.get('/ping', (req, res) => {
    res.send("hello world");
})

app.listen(3000)