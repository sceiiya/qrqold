import express, { json } from 'express'
import qrcode from 'qrcode'
import {v4 as uuid} from 'uuid'
import cors from 'cors'
// import { Cipher } from 'crypto'

let mockId = {
    "id":"bcf46ce4-5c9a-4f3d-900e-2d71539b8f58"
}

const ROSTER = [
    {
        "id": "c9e18f52-0c0f-4830-a13f-94efc98e466d",
        "name": "monke",
    },
    {
        "id": "bcf46ce4-5c9a-4f3d-900e-2d71539b8f58",
        "name": "kekw",
    },
    {
        "id": "9a931c0b-cb5f-4481-976c-5f95c4a1ac8d",
        "name": "rip bozos"
    }
]


const APP = express()
APP.use(cors())
APP.use(express.json())
// const QR = qrcode()
// uuid()
const PORT = process.env.PORT || 6969
const IP = process.env.IP || '192.168.100.4'

APP.listen(PORT, IP, () => {
    // const make = uuid()
    console.log(`running at port ${PORT}`)
    // console.log(`id = ${make}`)
})

APP.get('/wai', (req, res) => {
    res.sendStatus(418)
})

APP.get('/testqr', (req, res) => {
    const stJson = JSON.stringify(mockId)
    // let iName = uuid()
    let IName = Date.now()
    qrcode.toFile(`./images/${IName}.png`, stJson, {type: "terminal"}, (err, code) => {
        if(err) return console.log(err)
        console.log("qrcode generated")
    })
    res.send()
})

APP.post('/tracker/time-in', (req, res) => {
    const { body } = req
    const scannedID = body.id
    const enrolled = ROSTER.find((ROSTER => ROSTER.id === scannedID))
    if(enrolled) {
        console.log("enrolled")
        const logger = {}
        logger.id = body.id
        logger.time_in = new Date()
        const loggerName = enrolled.name
        console.log(`${loggerName} Entered Campus at :: ${logger.time_in.toLocaleString()}`)
        return res.status(201).send({"status": "Attendance Logged"})    
    }else{
        console.log("unauthorized")
        return res.status(404).send({"status": "unauthorized"})
    }
})
// const {
//     scrypt,
//     randomFill,
//     createCipheriv,
//   } = await import('node:crypto');
  
//   const algorithm = 'aes-192-cbc';
//   const password = 'pass';
  
//   // First, we'll generate the key. The key length is dependent on the algorithm.
//   // In this case for aes192, it is 24 bytes (192 bits).
//   scrypt(password, 'salt', 24, (err, key) => {
//     if (err) throw err;
//     // Then, we'll generate a random initialization vector
//     randomFill(new Uint8Array(16), (err, iv) => {
//       if (err) throw err;
  
//       // Once we have the key and iv, we can create and use the cipher...
//       const cipher = createCipheriv(algorithm, key, iv);
  
//       let encrypted = '';
//       cipher.setEncoding('hex');
  
//       cipher.on('data', (chunk) => encrypted += chunk);
//       cipher.on('end', () => console.log(encrypted));
  
//       cipher.write('some clear text data');
//       cipher.end();
//     });
//   });