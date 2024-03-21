import express, { json } from 'express'
import qrcode from 'qrcode'
import {v4 as uuid} from 'uuid'
import cors from 'cors'
import Mailgen from 'mailgen'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
// import { twiml } from 'twilio';
// const { MessagingResponse } = twiml;
// import { Cipher } from 'crypto'

// import * as twilio from 'twilio';

// const accountSid = 'your_account_sid';
// const authToken = 'your_auth_token';
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const myTwilNum = process.env.TWILIO_MY_NUM

// const twillioClient = twilio(accountSid, authToken);
// const client = require('twilio')(accountSid, authToken);
// const twillioClient = require.resolve('twilio');
// import(twillioClient).then((twilio) => {
//     const twillioClient = twilio(accountSid, authToken);
//     // Now you can use the client object
// }).catch((error) => {
//     console.error('Error loading twilio:', error);
// });



let mockId = {
    "id":"c9e18f52-0c0f-4830-a13f-94efc98e466d"
}

const ROSTER = [
    {
        "id": "c9e18f52-0c0f-4830-a13f-94efc98e466d",
        "name": "Gracel Flores",
        "email": "garcelgarcel01@gmail.com",
        "guardian_email": "yesimscheidj@protonmail.com",
        "guardian_number": "+639284418990"
    },
    {
        "id": "bcf46ce4-5c9a-4f3d-900e-2d71539b8f58",
        "name": "Morcel Flores",
        "email": "garcelgarcel01@gmail.com",
        "guardian_email": "yesimschedij@protonmail.com",
        "guardian_number": "+639284418990"
    },
    {
        "id": "9a931c0b-cb5f-4481-976c-5f95c4a1ac8d",
        "name": "Lorcel Flores",
        "email": "garcelgarcel01@gmail.com",
        "guardian_email": "yesimschedij@protonmail.com",
        "guardian_number": "+639284418990"
    }
]


const MAILUSER = process.env.MAIL_USER
const MAILPASS = process.env.MAIL_PASSWORD
const MAILSERVICE = process.env.MAILSERVICE

const mailConfig = {
    service: MAILSERVICE,
    auth: {
        user: MAILUSER,
        pass: MAILPASS
    }
}

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
    const sampleID = ROSTER[1].id
    console.log(sampleID)

    const stJson = JSON.stringify(mockId)
    // const samJson = JSON.stringify(`{${sampleID}}`)
    // // let iName = uuid()
    let IName = Date.now()
    
    qrcode.toFile(`./images/${IName}.png`, stJson, {type: "terminal"}, (err, code) => {
        if(err) return console.log(err)
        console.log("qrcode generated")
    })
    res.send({msg: "qrcode generated"})
})

APP.post('/tracker/time-in', (req, res) => {
    const { body } = req
    const scannedID = body.id
    const enrolled = ROSTER.find((ROSTER => ROSTER.id === scannedID))
    // console.log(enrolled)
    // console.log(enrolled.guardian_email)
    if(enrolled) {
        const loggerName = enrolled.name
        const loggerMail = enrolled.email
        const loggerGuardianMail = enrolled.guardian_email
        console.log(`${loggerName} is enrolled`)
        const logger = {}
        logger.id = body.id
        logger.time_in = new Date()
        console.log(`${loggerName} Entered Campus at :: ${logger.time_in.toLocaleString()}`)
        
        let mailTransporter = nodemailer.createTransport(mailConfig)

        let message = {
            from: MAILUSER,
            to: [loggerMail, loggerGuardianMail],
            subject: `Campus Attendance | ${loggerName} Attendance Notice`,
            html: `<b>This is a notice of your son/dauther's attendance to the campus</b>
                    <br></br>
                    <p>${loggerName} Have already entered the campus premises at exactly ${logger.time_in.toLocaleString()}.</p>
                    <p>Your guardian have also received the email at ${loggerGuardianMail}</p>
            `,
        };
    
        twillioClient.messages
        .create({
           body: `
           ${loggerName} Have already entered the campus premises at exactly ${logger.time_in.toLocaleString()}.
           <p>Your guardian have also received the email at ${loggerGuardianMail}</p>
   `,
           from: myTwilNum,
           to: enrolled.guardian_number
         })
        .then(message => console.log(message.sid));

        mailTransporter.sendMail(message).then((info) => {
            return res.status(201).json(
                {
                    msg: "Email sent",
                    info: info.messageId,
                    preview: nodemailer.getTestMessageUrl(info),
                    status_res: "Attendance Logged"
                }
            )
        }).catch((err) => {
            return res.status(500).json({ msg: err });
        })
        
        // return res.status(201).send({"status_res": "Attendance Logged"})    
    }else{
        console.log("unauthorized")
        return res.status(404).send({"status_res": "unauthorized"})
    }
})

APP.get('/api/mailtest', (req, res) => {

    let mailTransporter = nodemailer.createTransport(mailConfig)

    let message = {
        from: MAILUSER,
        to: 'gpointed@gmail.com',
        subject: 'Welcome to ABC Website!',
        html: "<b>Hello Zuip world?</b>",
    };

    mailTransporter.sendMail(message).then((info) => {
        return res.status(201).json(
            {
                msg: "Email sent",
                info: info.messageId,
                preview: nodemailer.getTestMessageUrl(info)
            }
        )
    }).catch((err) => {
        return res.status(500).json({ msg: err });
    })

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