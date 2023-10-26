'use strict'

import express from "express";
import formidable from "formidable";

import fs from 'fs'
import { request } from "http";

const contents = []
const myserver = express();
console.log(myserver )
myserver.post('/save_form', (request, response) => {

    console.log(request,response )
    const myForm = formidable({
        uploadDir: 'public/uploads',
        keepExtensions: true
    })

    myForm.parse(request, (err, fields, files) => {
        if (err) console.warn(err);
        else {
            console.log(files);
            const content = {
                id: (Date.now() + Math.random() * 1e17).toString(36),
                vorname: fields.vorname[0],
                nachname: fields.nachname[0],
                email: fields.email[0],
                nachricht: fields.nachricht[0],
                abwesend:fields.options[0],
                
                crDate: Date.now()
            }

            contents.push(content);

            response.json(contents)
        }
    })
})

myserver.get('/load_form', (request, response) => {
    response.json(contents)
})


myserver.use(express.static('public', {
    extensions: ['html']
}));

const init = () => {
    myserver.listen(80, err => console.log(err || 'Server läuft'));
}

init();