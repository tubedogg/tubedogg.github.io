// ==UserScript==
// @name         3Play: Capture rate changes
// @namespace    http://idlewords.net/
// @version      0.1
// @description  Review messages to find rate changes and download as CSV
// @author       You
// @match        https://jobs.3playmedia.com/message_topics*
// @grant        none
// ==/UserScript==

function downloadCSV(csv, filename, nexttask = 'stay') {
    var csvFile;
    var downloadLink;

	if (csv != '\n') {
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

	var currentPageNo = 1;
	if (window.location.search != "") {
		currentPageNo = parseInt(window.location.search.substring(window.location.search.search('&p')+6));
	}

	var newloc = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search.substring(0, window.location.search.search('&p'));
    if (nexttask == 'next') {
        window.location.href = newloc + '&page=' + String(currentPageNo + 1)
    } else if (nexttask == 'prev' && currentPageNo > 1) {
        window.location.href = newloc + String(currentPageNo - 1)
	}
}

function prepareCSV(filename, nexttask = 'stay') {
	var changetexts = [];
	var changes = $('tr.load_message > td > p:contains("Pay review") > span.muted');

	changes.each(function() {
		var jobId = $(this).parent().text().split(']')[0].substring(6), oldPrice = '-1', newPrice = '-1';
		if ($(this).text().search('underpriced') > -1) {
			var initSplit = $(this).text().split('/minute', 2);
			oldPrice = initSplit[0].substring(initSplit[0].search('from ')+6);
			newPrice = initSplit[1].replace(' to $', '');
		}
		changetexts.push([jobId, oldPrice, newPrice].join(','));
	});

	// Download CSV file
    downloadCSV(changetexts.join("\n")+"\n", filename, nexttask);
}

var filename = 'Changes.csv';
$('<a class="btn csvbtn" style="float: right" id="csvnext">CSV+<a>').appendTo('#topic_list_scroll_area');
$('#csvnext').click(function(){prepareCSV(filename, 'next');});
$('<a class="btn csvbtn" style="float: right" id="csveq">CSV=<a>').appendTo('#topic_list_scroll_area');
$('#csveq').click(function(){prepareCSV(filename);});
$('<a class="btn csvbtn" style="float: right" id="csvprev">CSV-<a>').appendTo('#topic_list_scroll_area');
$('#csvprev').click(function(){prepareCSV(filename, 'prev');});


$('a[data-remote]').each(function(){
	$(this).removeAttr('data-remote');
});

