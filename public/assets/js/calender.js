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

        const currentDate = document.querySelector('.current-date');
        const daysTag = document.querySelector('.days');
        const prevNextIcon = document.querySelectorAll('.icons span');

        // aktuelle Datum bekommen

        let date = new Date(),
            currentYear = date.getFullYear(),
            currentMonth = date.getMonth();

        const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

        const renderCalender = () => {


            let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // gibt der erste Tag des Monats zb: mo di mi ...
            console.log(firstDayOfMonth);
            let lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();// gibt die Anzahl der Tage in einem Monat
            console.log(lastDateOfMonth);
            let lastDayOfMonth = new Date(currentYear, currentMonth, lastDateOfMonth).getDay();// gibt der letzte Tag des Monats
            console.log(lastDayOfMonth);
            let lasteDateOfLastMonth = new Date(currentYear, currentMonth, 0).getDate();// gibt der letzte Tag der vorherige Monats
            console.log(lasteDateOfLastMonth);

            let listTag = "";

            if (firstDayOfMonth == 0) {
                firstDayOfMonth = 7
            }

            for (let i = firstDayOfMonth - 1; i > 0; i--) { //gibt die Tage des letzte Monat, die im kalender einzusehen sind

                listTag += `<li class="inactive">${lasteDateOfLastMonth - i + 1}</li>`
            }

            for (let i = 1; i <= lastDateOfMonth; i++) {//gibt alle Tage Dieses Monat
                let today = i === date.getDate() && currentMonth === date.getMonth() && currentYear === date.getFullYear() ? "active" : "";
                listTag += `<li class="${today}">${i}</li>`

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


