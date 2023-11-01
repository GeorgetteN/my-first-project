
import dom, { create, $, $$ } from './dom.js'
// KONSTANTEN / VARIABLEN
const elements = {};

// FUNKTIONEN
const domMapping = () => {
    elements.formSign = dom.$('#formSign');
    elements.passwordconf = dom.$('#password');
    elements.showpassword = dom.$('#showPass');
}


const cleanFormData = () => {
    elements.formSign.reset();
}


const handleSubmit = evt => {
    evt.preventDefault();
    // Zu übertragende Daten aus dem Formular extrahieren
    const payload = new FormData(elements.formSign);
    fetch('/save_user', {
        method: 'post',
        body: payload
    }).then(
        res => res.json()
    ).then(
        res => {
            if (res.status == 'ok') {
                //console.log(res.data);
               cleanFormData() ;         // Hier werden die Felder zurückgesetzt
            } else {
                console.warn('err', res.err);
            }
        }
    ).catch(
        console.warn
    )
}


const showPass = () => {
    elements.passwordconf.type = "text";
}


const appendEventlisteners = () => {
    elements.formSign.addEventListener('submit', handleSubmit);
    elements.showpassword.addEventListener('onClick', showPass);
}


const init = () => {
    domMapping();
    appendEventlisteners();
}

// INIT
init();