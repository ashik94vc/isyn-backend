import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import Multer, {memoryStorage} from 'multer'
import request from 'request'
import {ImageAnnotatorClient} from'@google-cloud/vision'

import VisionData from './model' 
import config from './config'

let storage = Multer.memoryStorage()
let upload = Multer({storage: storage})


const API_KEY = config.get('GOOGLE_APPLICATION_CREDENTIALS')

console.log(API_KEY)
const client = new ImageAnnotatorClient()

const httpPort = process.env.PORT || 8080;
let app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}))

app.post('/image', upload.single('image'), (req,res)=>{
    let image_data = req.file.buffer
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
    console.log("Server listening on port "+ httpPort)
});