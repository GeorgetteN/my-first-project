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

    const payload = new FormData(elements.formNewContent);
    console.log(payload);

    fetch('/save_form', {
        method: 'post', 
        body: payload
    }).then(
        res => res.json()
    ).then(
        res => console.log(res)
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