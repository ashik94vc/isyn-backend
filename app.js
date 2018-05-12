import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import Multer, {memoryStorage} from 'multer'
import request from 'request'
import {ImageAnnotatorClient} from'@google-cloud/vision'

import VisionData from './model' 
import config from './config'



const API_KEY = config.get('CLOUD_VISION_API_KEY')

const VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate?key="+API_KEY

const client = new ImageAnnotatorClient()

const httpPort = process.env.PORT || 8080;
let app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}))

app.post('/image', (req,res)=>{
    let image_data = Buffer.from(req.body.image, 'base64')
    let visionData = new VisionData(image_data)
    client
        .labelDetection(image_data)
        .then(results => {
            const labels = results[0].labelAnnotations
            let mLabels = []
            labels.forEach(label => {
                mLabels.push({"description": label.description, "score": label.score})
            })
            res.json({"results": mLabels})
        })
})


app.use((req,res)=>{
    res.status(404).send("Not Found")
})

app.listen(httpPort, function(){
    console.log("Server listening on port "+httpPort)
});