// ==UserScript==
// @name         3Play: Download Invoice as CSV
// @namespace    http://idlewords.net
// @version      0.1
// @description  Allow downloading of invoice as CSV file
// @author       You
// @match        http*://jobs.3playmedia.com/pay_stubs/*
// @grant        unsafeWindow
// @grant		 window.close
// ==/UserScript==

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("#pay-stub-table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++) {
            var rowtext = cols[j].innerText;
            while (rowtext.search(',') > -1) {
				rowtext = rowtext.replace(',', '.');
			}
            row.push(rowtext);
        }

        row = row.join(",");
        if (row.search(/ID,Label,Job|Totals\sfor|Pay\sadjustment|Total,[0-9]/) < 0) {
            csv.push(row);
        } else {
			console.log(row);
		}
    }

    // Download CSV file
    downloadCSV(csv.join("\n")+"\n", filename);
}

var paidDate = $('b:contains("Paid Date")').first().parent().text().split('\n')[5];
if (paidDate == 'Open') {
	var filename = 'Invoice-Current.csv';
} else {
	var filename = 'Invoice-' + paidDate + '.csv';
}

var newEl = document.createElement('a');
newEl.className = 'btn';
newEl.onclick = function(){exportTableToCSV(filename);};
newEl.innerHTML = 'CSV';
var button = document.querySelector('.btn.print-page');
button.parentNode.insertBefore(newEl, button);

if (window.location.search.search('dlcsv=1') > -1) {
	exportTableToCSV(filename);
	window.close();
}