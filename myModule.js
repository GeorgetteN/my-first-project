'use strict'

import express from "express";
import formidable from "formidable";
import nano from 'nano';
import settings from './settings.js';

import fs from 'fs'
import { request } from "http";


// Webserver
const myserver = express();

myserver.use(express.static('public', {
    extensions: ['html']
}));

// Middleware: JSON-Daten extrahieren und in body legen
myserver.use(express.json());

// Datenbank
const db = nano(`http://${settings.user}:${settings.password}@127.0.0.1:5984`).db;
const dbForm = 'formularcontents';
const dbUser = 'user';



const sendError = (response, err) => {
    console.warn(err);
    response.json({
        status: 'err',
        err
    })
}


const loadAndSendAllContents = (response, myDB) => {
    myDB.list({ include_docs: true }).then(
        res => res.rows.map(row => row.doc)
    ).then(
        res => response.json({
            status: 'ok',
            data: res
        })
    ).catch(
        err => {
            sendError(response, err)
        }
    )
}



myserver.post('/save_form', (request, response) => {
    const myForm = formidable({
        uploadDir: 'public/uploads',
        keepExtensions: true
    })
    myForm.parse(request, (err, fields, files) => {
        if (fields.userpass[0] !== fields.userconfirmpass[0]) {
            sendError(response, "Passwörter sind nicht gleich");
        } else {
            const date = new Date();
            const content = {
                vorname: fields.vorname[0],
                nachname: fields.nachname[0],
                email: fields.email[0],
                nachricht: fields.nachricht[0],
                abwesend: fields.options[0],
                startdate: fields.start_date[0],
                enddate: fields.end_date[0],
                requestdate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            };
            const myDB = db.use(dbForm);  // Datenbank ansprechen

            myDB.insert(content).then(   // Content-Objekt in Datenbank schreiben
                () => loadAndSendAllContents(response, myDB)
            )
        }
    })
})



myserver.post('/save_user', (request, response) => {
    const myForm = formidable({
        uploadDir: 'public/uploads',
        keepExtensions: true
    })
    myForm.parse(request, (err, fields, files) => {
        console.log(fields);
        if (fields.userpass[0] !== fields.userconfirmpass[0]) {
            sendError(response, "Passwort Fehler");
        } else {
            const date = new Date();
            const content = {
                userame: fields.username[0],
                useremail: fields.useremail[0],
                userpass: fields.userpass[0],
                departement: fields.departement[0],
                registerdate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                termCon: fields.termCon
            };
            const myDB = db.use(dbUser);

            myDB.insert(content).then(
                () => loadAndSendAllContents(response, myDB)
            );
        }
    });
})


myserver.get('/load_user', (request, response) => {
    const myDB = db.use(dbUser);
    loadAndSendAllContents(response, myDB) // Aktuelle Contents aus der DB laden
})



myserver.get('/load_form', (request, response) => {
    const myDB = db.use(dbForm);
    loadAndSendAllContents(response, myDB) // Aktuelle Contents aus der DB laden
});



const init = () => {
    let dbList = [];
    // Prüfen, ob die gewünschte DB existiert
    db.list().then(
        res => {
            dbList = res
            if (!dbList.includes(dbForm)) return db.create(dbForm);  // Falls sie nicht existiert, neu anlegen
        }
    ).then(
        res => {
            if (!dbList.includes(dbUser)) return db.create(dbUser);  // Falls sie nicht existiert, neu anlegen
        }
    ).then(
        () => {
            myserver.listen(80, err => console.log(err || 'Server läuft')); // Server startet erst, wenn die DB bereit ist
        }
    ).catch(
        console.warn
    )
}

init();