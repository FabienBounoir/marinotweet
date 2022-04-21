const express = require('express')
const fs = require('fs/promises')
const app = express()
const port = 1234
const puppeteer = require('puppeteer');


// const nodeHtmlToImage = require('node-html-to-image')
// const font2base64 = require('node-font2base64')


app.get('/', async (req, res) => {
    // console.log(image)
    // console.log(req.query);

    const url = req.query.url
    const username = req.query.username
    const texte = req.query.texte

    const dataURIBackground = 'data:image/jpeg;base64,' + new Buffer.from(await fs.readFile('./assets/marinotweetBackground.png')).toString('base64');
    const dataURICalque = 'data:image/jpeg;base64,' + new Buffer.from(await fs.readFile('./assets/marinotweetCleanNoPaper.png')).toString('base64');

    const hour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    //random entre 0 et 100
    const nbRt = Math.floor(Math.random() * 100)
    const nbTwt = Math.floor(Math.random() * 100)
    const likes = Math.floor(Math.random() * 100)

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 3584,
        height: 2018,
        deviceScaleFactor: 1,
    });

    await page.setContent(`<html>
            <head>
            <style>
                :root {
                    font-family: 'Source Sans Pro', 'Lucida Grande', sans-serif;
                    color: #3B3F43;
                }

                body {
                    width: 3584px;
                    height: 2018px;
                    background: url({{dataURIBackground}}) no-repeat center center fixed;
                }

                img {
                    transform: rotate(-4deg);
                    position: fixed;
                    top: 1195px;
                    left: 1465px;
                    border-radius: 30000em;
                    width: 120px;
                    filter: blur(1.5px);
                }

                h1{
                    position: fixed;
                    top: 1160px;
                    left: 1600px;
                    font-size: 45px;
                    font-weight: bold;
                    transform: rotate(-4deg);
                    font-weight: 500;
                    filter: blur(1.5px);
                }

                h2{
                    position: fixed;
                    top: 1220px;
                    left: 1605px;
                    font-size: 30px;
                    font-weight: bold;
                    transform: rotate(-4deg);
                    font-weight: 300;
                    filter: blur(1.5px);
                }

                .texte {
                    position: fixed;
                    top: 1310px;
                    left: 1490px;
                    font-size: 35px;
                    font-weight: bold;
                    transform: rotate(-4deg);
                    width: 740px;
                    line-height: 1.3;
                    word-wrap: break-word;
                    font-weight: 400;
                    filter: blur(1.5px);
                }

                .info {
                    position: fixed;
                    top: 1570px;
                    left: 1500px;
                    font-size: 29px;
                    transform: rotate(-4deg);
                    width: 740px;
                    line-height: 1.3;
                    word-wrap: break-word;
                    font-weight: 300;
                    filter: blur(1.5px);
                }

                footer {
                    position: fixed;
                    top: 1675px;
                    left: 1500px;
                    transform: rotate(-4deg);
                    font-size: 29px;
                    filter: blur(1.5px);
                }

                div {
                    position: fixed;
                    width: 3584px;
                    height: 2018px;
                    background: url({{dataURICalque}}) no-repeat center center fixed;
                }

                span {
                    color: red;
                    filter: blur(1.5px);
                }

            </style>
            </head>
            <body>
            <img src="{{imageAvatar}}" />
            <h1>{{username}}</h1>
            <h2>@{{username}}</h2>
            <p class="texte">{{texte}}</p>
            <p class="info">{{hour}}ㆍ{{date}}</p>
            <footer><b>{{nbRt}}</b> Retweets   <b>{{nbTwt}}</b> Tweets cités   <b>{{likes}}</b> j'aime</footer>
            <div></div>
            </body>
        </html>
        `
        .replace('{{dataURIBackground}}', dataURIBackground)
        .replace('{{dataURICalque}}', dataURICalque)
        .replace('{{imageAvatar}}', url)
        .replace(/{{username}}/g, username)
        .replace('{{texte}}', texte)
        .replace('{{hour}}', hour)
        .replace('{{date}}', date)
        .replace('{{nbRt}}', nbRt)
        .replace('{{nbTwt}}', nbTwt)
        .replace('{{likes}}', likes)
    );

    const buffer = await page.screenshot({
        encoding: 'binary',
        type: 'jpeg',
        quality: 100
    });

    await browser.close();

    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(buffer, "binary");
});

app.listen(port, () => {
    console.log(`Serveur ecoute sur le port ${port}`)
})