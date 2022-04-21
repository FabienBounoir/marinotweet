const express = require('express')
const fs = require('fs/promises')
const app = express()
const port = 1234

const nodeHtmlToImage = require('node-html-to-image')
const font2base64 = require('node-font2base64')

const _data = font2base64.encodeToDataUrlSync('./assets/chirp.ttf')

app.get('/', async (req, res) => {
    // console.log(image)
    // console.log(req.query);

    const url = req.query.url
    const username = req.query.username
    const texte = req.query.texte

    const image = await fs.readFile('./assets/marinotweet.png')
    const base64Image = new Buffer.from(image).toString('base64');
    const dataURI = 'data:image/jpeg;base64,' + base64Image

    const imageRender = await nodeHtmlToImage({
        html: `<html>
            <head>
            <style>
                :root {
                    filter: blur(1px);
                }

                body {
                    width: 3584px;
                    height: 2018px;
                    background: url({{imageSource}}) no-repeat center center fixed;
                }

                img {
                    transform: rotate(-4deg);
                    position: fixed;
                    top: 1195px;
                    left: 1465px;
                    border-radius: 30000em;
                    width: 120px;
                }

                h1{
                    position: fixed;
                    top: 1160px;
                    left: 1600px;
                    font-size: 45px;
                    font-weight: bold;
                    transform: rotate(-4deg);
                }

                p{
                    position: fixed;
                    top: 1310px;
                    left: 1490px;
                    font-size: 35px;
                    font-weight: bold;
                    transform: rotate(-4deg);
                    width: 740px;
                    line-height: 1.3;
                    font-family: 'Source Sans Pro', 'Lucida Grande', sans-serif;
                    word-wrap: break-word;
                    color: rgb(15, 20, 25);
                }

                footer {
                    position: fixed;
                    top: 1675px;
                    left: 1490px;
                    transform: rotate(-4deg);
                    color: rgb(15, 20, 25);
                    font-size: 29px;
                    font-family: 'Source Sans Pro', 'Lucida Grande', sans-serif;
                }

            </style>
            </head>
            <body>
            <img src="{{imageAvatar}}" />
            <h1>{{username}}</h1>
            <p>{{texte}}</p>
            <footer><b>76</b> Retweets   <b>4</b> Tweets cités   <b>58</b> j'aime</footer>
            </body>
        </html>
        `,
        content: { imageSource: dataURI, imageAvatar: url, username, texte }
    })

    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(imageRender, 'binary');
})

app.listen(port, () => {
    console.log(`Serveur ecoute sur le port ${port}`)
})