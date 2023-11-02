'use strict';

import dom, { create } from './dom.js';

// KONSTANTEN / VARIABLEN
const elements = {};
const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
let contents;

// FUNKTIONEN
const domMapping = () => {
    //elements.main = dom.$('main');
    elements.savedUseremail = localStorage.getItem('savedUseremail');
    elements.profuser = dom.$('.user-profil');
    elements.mychartObject = dom.$('#myChart');
    elements.table = dom.$('.usertab');
    elements.btnTable = dom.$('#showT');
    elements.btnGrafik = dom.$('#showG');
    elements.calender = dom.$('main');
}





const renderContents = (contents) => {
    const mainElement = document.querySelector('main');

    contents.forEach(content => {
        if (mainElement && elements.savedUseremail && content.email == elements.savedUseremail) {

            const currentDate = document.querySelector('.current-date');
            const daysTag = document.querySelector('.days');
            const prevNextIcon = document.querySelectorAll('.icons span');

            //Tablelle erstellen


            //chart Object erstellen

            const chart = new Chart(elements.mychartObject, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        label: "Grafik",
                        data: [...new Array(12)].map((value, index) => getCounter(index + 1)),
                        borderColor: '#36A2EB',
                        backgroundColor: '#9BD0F5'
                    }]
                }
            });

            let date = new Date(),// aktuelle Datum bekommen
                currentYear = date.getFullYear(),
                currentMonth = date.getMonth();

            const renderCalender = () => {

                let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // gibt der erste Tag des Monats zb: mo di mi ...
                let lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();// gibt die Anzahl der Tage in einem Monat
                let lastDayOfMonth = new Date(currentYear, currentMonth, lastDateOfMonth).getDay();// gibt der letzte Tag des Monats
                let lasteDateOfLastMonth = new Date(currentYear, currentMonth, 0).getDate();// gibt der letzte Tag der vorherige Monats

                let listTag = "";

                if (firstDayOfMonth == 0) {
                    firstDayOfMonth = 7
                }

                for (let i = firstDayOfMonth - 1; i > 0; i--) { //gibt die Tage des letzte Monat, die im kalender einzusehen sind
                    listTag += `<li class="inactive">${lasteDateOfLastMonth - i + 1}</li>`
                }

                for (let i = 1; i <= lastDateOfMonth; i++) {//gibt alle Tage Dieses Monat
                    let today = i === date.getDate() && currentMonth === date.getMonth() && currentYear === date.getFullYear() ? "active" : "";
                    let currentDay = dateToTimestamp(currentYear + "-" + currentMonth + "-" + i);
                    const isDateInArray = getAbsenteDate().some(date => new Date(date).toLocaleDateString() === new Date(currentDay).toLocaleDateString())
                    let listTagClass = isDateInArray ? "absentDays" : "";
                    listTag += `<li class="${today} ${listTagClass}">${i}</li>`;
                }

                for (let i = lastDayOfMonth; i < 7; i++) {// gibt die Tage der Kommende Monat, die im kalender einzusehen sind
                    listTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`
                }
                currentDate.innerText = `${months[currentMonth]} ${currentYear}`;
                daysTag.innerHTML = listTag;

            }
            renderCalender();

            prevNextIcon.forEach(icon => {
                icon.addEventListener("click", () => {
                    currentMonth = icon.id === "prev" ? currentMonth - 1 : currentMonth + 1;

                    if (currentMonth < 0 || currentMonth > 11) { // wenn aktuel Monat kleiner als 0 oder größer a 11
                        date = new Date(currentYear, currentMonth); // erzeugen wir ein neuer Tag
                        currentYear = date.getFullYear(); //Jahr muss aktualisiert sein
                        currentMonth = date.getMonth();//Monat muss auch aktualisiert sein
                    } else {
                        date = new Date();
                    }
                    renderCalender()
                })

            });
        }
    })
}


const getAbsenteDate = () => {
    let result = [];
    contents.forEach(content => {
        let start = new Date(content.startdate)
        let end = new Date(content.enddate)
        for (let day = start.getTime(); day <= end.getTime(); day += 24 * 60 * 60 * 1000) {
            const isDateInArray = result.some(date => date === day)
            if (!isDateInArray)
                result.push(day);
        }
    })
    return result;
}



const dateToTimestamp = (value) => {
    value = value.split("-");
    value = new Date(value[0], value[1], value[2], 7);
    value = value.getTime();
    return value;
}



const getCounter = (currentM) => {
    let days = 30;
    let urlaubTage = 0;
    if (currentM == 1 || currentM == 3 || currentM == 5 || currentM == 7 || currentM == 8 || currentM == 10 || currentM == 12) {
        days = 31;
    } else if (currentM == 2) {
        days = 28;
    }
    for (let index = 1; index <= days; index++) {
        let currentDay = dateToTimestamp(new Date().getFullYear() + "-" + currentM + "-" + index)
        contents.forEach(content => {
            let start = dateToTimestamp(content.startdate)
            let end = dateToTimestamp(content.enddate)
            for (let day = start; day <= end; day += 24 * 60 * 60 * 1000) {
                if (currentDay >= day && currentDay <= day + 24 * 60 * 60 * 1000) {
                    urlaubTage++;
                }
            }
        })
    }
    return urlaubTage;
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

const handleSubmitBtnTab = () => {
    const filteredUsers = contents.filter(content => content.email === elements.savedUseremail);
    elements.mychartObject.style.display = 'none';
    elements.table.innerHTML = "";
    elements.calender.style.display = 'none';
    elements.btnTable.style.backgroundColor = '#ccc';
    console.log(filteredUsers)
    renderContentTables(filteredUsers);
}


const renderContentTables = values => {
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

        values.forEach(content => {
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

const handleSubmitBtnGraf=()=>{
    window.location.href="./calender.html" ;
}

const appendEventlistenersTb = () => {
    elements.btnTable.addEventListener('click', handleSubmitBtnTab);
}

const appendEventlistenersG = () => {
    elements.btnGrafik.addEventListener('click', handleSubmitBtnGraf);
}

const init = () => {
    domMapping();
    appendEventlistenersTb();
    appendEventlistenersG();
    loadContents().then(
        res => contents = res
    ).then(
        renderContents
    ).catch(
        console.warn
    );
}

// INIT
init();


