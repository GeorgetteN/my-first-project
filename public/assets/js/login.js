'use strict';

import dom, { create } from './dom.js';

// KONSTANTEN / VARIABLEN
const elements = {};

// FUNKTIONEN
const domMapping = () => {
    elements.formLogin = dom.$('#formLogin');
    elements.name = dom.$('#username');
    elements.pass = dom.$('#password');
    elements.pass.classList.remove('error');
    elements.logContainer =dom.$('.container');
    elements.profContainer =dom.$('.profile');
    elements.profname =dom.$('.name');
    elements.profemail =dom.$('.email');
}

const appendEventlisteners = () => {
    elements.formLogin.addEventListener('submit', handleSubmit);
}

const renderPreview = (contents, namedata, passdata) => {

    contents.forEach(content => {
        if (typeof namedata !== "undefined" && typeof passdata !== "undefined"){
            if(content.userame === namedata && content.userpass === passdata) {
                console.log (content)
                elements.logContainer.style.display = 'none';
                elements.profContainer.style.display = 'block';
                elements.profname.innerText = content.userame;
                elements.profemail.innerText = content.useremail;
            } else {
                elements.pass.classList.add('error');
            }
        }    
    })
}



const handleSubmit = async evt => {
    evt.preventDefault();
    // Zu übertragende Daten aus dem Formular extrahieren
    const payload = new FormData(elements.formLogin);

    let name = payload.get("username");
    let pass = payload.get("password");

    const res = await fetch('/load_user');
    const res_1 = await res.json();
    console.log(res_1);
    if (res_1.status == 'ok') {
        return renderPreview(res_1.data, name, pass);
    } else {
        throw res_1.err;
    }
}


const loadData = () => {
    return fetch('/load_user').then(
        res => res.json()
    ).then(
        res => {
            console.log(res);
            if (res.status == 'ok') {
                return res.data
            } else {
                throw res.err;
            }
        }
    )
}

const init = () => {
    domMapping();
    appendEventlisteners();
    loadData().then(
        renderPreview
    ).catch(
        console.warn
    );
}

// INIT
init();