'use strict';


// KONSTANTEN / VARIABLEN
const elements = {};

// FUNKTIONEN
const domMapping = () => {
    //elements.mainTable = dom.$('mainTable');
}

const renderContentTables = contents => {
    const mainTableElement = document.querySelector('mainTable');


    if (mainTableElement) {
        const tableElement = document.createElement('table');
        tableElement.id = 'employees';

        // Tabelle body erzeugen
        const tbodyElement = document.createElement('tbody');
        const headerRow = document.createElement('tr');

        // Tabelle header erzeugen 
        const headers = ['Vorname', 'Nachname', 'Email', 'Angetragen am', 'Abwesenheitsart', 'Von', 'Bis', 'Hinweis', 'Vertreter', 'Zeitraum'];

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
            cell4.textContent = content.requestdate;
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
            const cell9 = document.createElement('td');
            cell9.textContent = content.vertreter;
            row.appendChild(cell9);
            const cell10 = document.createElement('td');
            cell10.textContent = content.zeit;
            row.appendChild(cell10);
            tbodyElement.appendChild(row);
        })
        tableElement.appendChild(tbodyElement);

        // Tabelle in mainTable tag einfügen
        const containerElement = document.querySelector('mainTable');
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
        renderContentTables
    ).catch(
        console.warn
    );
}

// INIT
init();




