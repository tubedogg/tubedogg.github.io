// ==UserScript==
// @name         3Play: Get Project Details
// @namespace    http://idlewords.net
// @version      0.1
// @description  Download project details from Account History section
// @author       You
// @include		 /https?://jobs\.3playmedia\.com/completed_jobs(?!/\d{7}).*/
// @grant        unsafeWindow
// ==/UserScript==

function downloadCSV(csv, filename, nexttask) {
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

	if (window.location.search != "") {
		currentPageNo = parseInt(window.location.search.replace('?page=', ''));
	} else {
		currentPageNo = 1;
	}

    // go to prev
    if (nexttask == 'next') {
        var newloc = window.location.protocol + '//' + window.location.host + window.location.pathname + '?page=' + String(currentPageNo + 1)
        window.location.href = newloc
    } else if (nexttask == 'prev' && currentPageNo > 1) {
        var newloc = window.location.protocol + '//' + window.location.host + window.location.pathname + '?page=' + String(currentPageNo - 1)
        window.location.href = newloc
    }
}

var jobs = $('div.job_name > b');

var job_details = ''; //var job_details = "Job ID, Client\n";
jobs.each(function(){
    job_details += $(this).parent().parent().parent().attr('data_url').split('/')[4] + ',' + $(this).text().trim().replace(',', '.') + "\n";
});

var newEl = document.createElement('a');
newEl.className = 'btn';
newEl.onclick = function(){downloadCSV(job_details, 'ClientNames.csv', 'next');};
newEl.innerHTML = 'C+';
$(newEl).insertAfter('.btn.btn-success');

var newEl = document.createElement('a');
newEl.className = 'btn';
newEl.onclick = function(){downloadCSV(job_details, 'ClientNames.csv', 'stay');};
newEl.innerHTML = 'C=';
$(newEl).insertAfter('.btn.btn-success');

var newEl = document.createElement('a');
newEl.className = 'btn';
newEl.onclick = function(){downloadCSV(job_details, 'ClientNames.csv', 'prev');};
newEl.innerHTML = 'C-';
$(newEl).insertAfter('.btn.btn-success');