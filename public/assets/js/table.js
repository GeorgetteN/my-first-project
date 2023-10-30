'use strict';


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
        tableElement.id = 'employees';

        // Tabelle body erzeugen
        const tbodyElement = document.createElement('tbody');
        const headerRow = document.createElement('tr');

        // Tabelle header erzeugen 
        const headers = ['Vorname', 'Nachname', 'Email', 'Angetragen am', 'Abwesenheitsart', 'Von', 'Bis', 'Hinweis'];

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
            cell2.textContent = content.nachname;
            row.appendChild(cell2);
            const cell3 = document.createElement('td');
            cell3.textContent = content.email;
            row.appendChild(cell3);
            const cell4 = document.createElement('td');
            cell4.textContent = content.antragstag;
            row.appendChild(cell4);
            const cell5 = document.createElement('td');
            cell5.textContent = content.abwesend;
            row.appendChild(cell5);
            const cell6 = document.createElement('td');
            cell6.textContent = content.startdate;
            row.appendChild(cell6);
            const cell7 = document.createElement('td');
            cell7.textContent = content.enddate;
            row.appendChild(cell7);
            const cell8 = document.createElement('td');
            cell8.textContent = content.nachricht;
            row.appendChild(cell8);
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
    loadContents().then(
        renderContents
    ).catch(
        console.warn
    );
}

// INIT
init();


