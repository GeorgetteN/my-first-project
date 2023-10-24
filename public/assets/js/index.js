'use strict';


import dom from "./dom.js";


// KONSTANTEN / VARIABLEN
const elements = {};

// FUNKTIONEN
const domMapping = () => {
    //elements.main = dom.$('main');
}

const renderContents = contents => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
    

        const tableElement = document.createElement('table');
        tableElement.id = 'Employe'; 

        // Tabelle body erzeugen
        const tbodyElement = document.createElement('tbody');
        const headerRow = document.createElement('tr');

        // Tabelle header erzeugen 
        const headers = ['Vorname', 'Nachname', 'Email'];

        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });

        // neu ligne hinzufügen
        tbodyElement.appendChild(headerRow);

        contents.forEach(content => {
            console.log(content)
            const row = document.createElement('tr');
            const cell1 = document.createElement('td');
            cell1.textContent = content.vorname;
            row.appendChild(cell1);
            const cell2 = document.createElement('td');
            console.log(content.nachname)
            cell2.textContent = content.nachname;
            row.appendChild(cell2);
            const cell3 = document.createElement('td');
            cell3.textContent = content.email;
            row.appendChild(cell3);
            tbodyElement.appendChild(row);
        })
        tableElement.appendChild(tbodyElement);

        // Tabelle in Main tag einfügen
        const containerElement = document.querySelector('main'); 
        containerElement.appendChild(tableElement);
    }
}

const loadContents = () => {
    return fetch('/load_form').then(
        res => res.json())
}

const init = () => {
    domMapping();
    loadContents().then(
        renderContents
    ).catch(
        console.warn
    );
}

// INIT
init();


