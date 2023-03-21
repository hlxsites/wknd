import { fetchIndex } from '../../scripts/scripts.js';

function parseDateTime(d, t) {
    var d = new Date(d);
    var time = t.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
    d.setMinutes(parseInt(time[2]) || 0);
    return d;
}

function dateTimeSort(a, b) {
    var c = parseDateTime(a['Date'], a['Time']);
    var d = parseDateTime(b['Date'], b['Time']);
    return c-d; 
}

/**
 *
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
    // Fetch items from index
    const indexContent = await fetchIndex('drafts/summit23/beatthebuzzer/leaderboard');
    const data = indexContent.data;

    // Create the table
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = 'Date';
    headerRow.insertCell().textContent = 'Name';
    headerRow.insertCell().textContent = 'Time';
    headerRow.insertCell().textContent = 'URL';

    // Sort the rows by time
   data.sort(dateTimeSort);

    // Add the rows to the table
    data.forEach(row => {
        // console.log("row:", row); // debug
        const tableRow = table.insertRow();
        tableRow.insertCell().textContent = row['Date'];
        tableRow.insertCell().textContent = row['Name'];
        tableRow.insertCell().textContent = row['Time'];
        tableRow.insertCell().innerHTML = `<a href="${row['URL']}">${row['URL']}</a>`;
    });

    // Add the table to the page
    block.append(table);
}




