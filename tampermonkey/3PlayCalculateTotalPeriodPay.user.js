// ==UserScript==
// @name         3Play: Calculate Total Period Pay
// @namespace    http://idlewords.net
// @version      0.3
// @description  Show both completed pay amount and projected total including amount in queue
// @author       You
// @match        https://jobs.3playmedia.com/available_jobs*
// @match        https://jobs.3playmedia.com/assigned_jobs*
// @grant        none
// @require      https://greasyfork.org/scripts/390229-mutationsummary/code/MutationSummary.js?version=733946
// ==/UserScript==


$("tr.clickable_row:first").parent().attr('id', 'market_tbody');

function calculate_pay() {
    $("li#current_pay > div.main_text").attr('id', 'invoice_pay');
    var total_pay = 0;
    $("#current_pay > div > h2, #current_pay > h2").each(function(){
        curNumber = +$(this).text().replace('$','').replace(',', '');
        total_pay = total_pay + curNumber;
    });

    total_pay = "&nbsp;/&nbsp;$" + total_pay.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    $("#invoice_pay").find('h2').first().html($("#invoice_pay").find('h2:first').text() + total_pay);
}

// function fix_projects() {
//     $("#project_filters").parent().css('height', '300px');
//     $("#project_filter_header > div > a").removeClass("collapsed");
//     $("#projectContent").removeClass('in').css('height', '350px');

//     $("#upcoming_deadlines").css('width', '220px');
//     $("#current_pay").css('width', '240px');
// }

calculate_pay();
// fix_projects();

var observer1 = new MutationSummary({
    callback: handlePayChange,
    queries: [{ element: "#invoice_pay" }]
});

// var observer2 = new MutationSummary({
//     callback: handleFixProjects,
//     queries: [{ element: "#market_tbody" }]
// });

// var observer3 = new MutationSummary({
//     callback: handleAddMuted,
//     queries: [{ element: "#market_tbody" }]
// });

function handlePayChange(summaries) {
    calculate_pay();
}

// function handleFixProjects(summaries) {
//     fix_projects();
// }

// function handleAddMuted(summaries) {
//     add_muted();
// }