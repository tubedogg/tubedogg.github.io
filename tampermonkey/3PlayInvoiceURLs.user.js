// ==UserScript==
// @name         3Play: Invoice URLs
// @namespace    http://idlewords.net
// @version      0.1
// @description  Add links to view or download CSV to Invoices list
// @author       You
// @match        https://jobs.3playmedia.com/pay_stubs
// @match		 https://jobs.3playmedia.com/pay_stubs?page=*
// @grant        none
// ==/UserScript==

$("div#pay-statement-table > thead > tr").append("<th>Link</th>");

$('a[data-remote]').each(function(){
	$(this).removeAttr('data-remote');
});

$("tr[data_url]").each(function(){
	$(this).append('<td><a href="' + $(this).attr('data_url') + '">View</a> <a href="' + $(this).attr('data_url') + '?dlcsv=1" target="_new">D/L</a></td>');
	$(this).removeAttr('data_url');
});