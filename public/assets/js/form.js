'use strict';

import dom, { create, $, $$ } from './dom.js'
// KONSTANTEN / VARIABLEN
const elements = {};

// FUNKTIONEN
const domMapping = () => {
    elements.formNewContent = dom.$('#formNewContent');
}

const handleSubmit = evt => {
    evt.preventDefault();
 // Zu übertragende Daten aus dem Formular extrahieren
    const payload = new FormData(elements.formNewContent);
    console.log("playload:"+ payload);

    fetch('/save_form', {
        method: 'post', 
        body: payload
    }).then(
        res => res.json()
    ).then(
        res => {
            if (res.status == 'ok') {
                console.log(res.data);
            } else {
                console.warn('err', res.err);
            }
        }
    ).catch(
        console.warn
        )}

const appendEventlisteners = () => {
    elements.formNewContent.addEventListener('submit', handleSubmit);
}

const init = () => {
    domMapping();
    appendEventlisteners();
}

// INIT
init();