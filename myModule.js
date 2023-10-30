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
const dbName = 'formularcontents';

myserver.post('/save_form', (request, response) => {

    const myForm = formidable({
        uploadDir: 'public/uploads',
        keepExtensions: true
    })

    myForm.parse(request, (err, fields, files) => {
        if (err) console.warn(err);
        else {
         
            console.log(fields);
            const date = new Date();
            const content = {
                vorname: fields.vorname[0],
                nachname: fields.nachname[0],
                email: fields.email[0],
                nachricht: fields.nachricht[0],
                abwesend: fields.options[0],
                startdate:fields.start_date[0],
                enddate:fields.end_date[0],
                antragstag: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            }
            // Datenbank ansprechen
            const myDB = db.use(dbName);

            // Content-Objekt in Datenbank schreiben
            myDB.insert(content).then(
                // Aktuelle Contents aus der DB laden
                () => myDB.list({ include_docs: true })
            ).then(
                // Antwort filtern und nur die Nutzdaten weiterreichen
                res => res.rows.map(row => row.doc)
            ).then(
                // Anwort an den Client
                res => response.json({
                    status: 'ok',
                    data: res
                })
            ).catch(
                // Fehlermeldung
                err => {
                    console.warn(err);
                    response.json({
                        status: 'err',
                        err
                    })
                }
            )
        }
    })
})

myserver.get('/load_form', (request, response) => {
    const myDB = db.use(dbName);

    // Aktuelle Contents aus der DB laden
    myDB.list({ include_docs: true }).then(
        res => res.rows.map(row => row.doc)
    ).then(
        res => response.json({
            status: 'ok',
            data: res
        })
    ).catch(
        err => {
            console.warn(err);
            response.json({
                status: 'err',
                err
            })
        }
    )
})



const init = () => {
    // Prüfen, ob die gewünschte DB ecistiert
    db.list().then(
        res => {
            // Falls sie nicht existiert, neu anlegen
            if (!res.includes(dbName)) {
                return db.create(dbName);
            }
        }
    ).then(
        () => {
            // Server startet erst, wenn die DB bereit ist
            myserver.listen(80, err => console.log(err || 'Server läuft'));
        }
    ).catch(
        console.warn
    )
}

init();