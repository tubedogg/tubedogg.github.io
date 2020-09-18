// ==UserScript==
// @name         3Play: Sum Invoice Rows
// @namespace    http://idlewords.net
// @version      0.1
// @description  Sum invoice rows per day
// @author       You
// @match        https://jobs.3playmedia.com/pay_stubs/*
// @grant        unsafeWindow
// ==/UserScript==

this_year = (new Date()).getFullYear();
if (this_year % 4 === 0) {
    feb_days = 29;
} else {
    feb_days = 28;
}
monthends = {"Jan": 31, "Feb": feb_days, "Mar": 31, "Apr": 30, "May": 31, "Jun": 30, "Jul": 31, "Aug": 31, "Sep": 30, "Oct": 31, "Nov": 30, "Dec": 31};
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
early_selector = contains_selector(["00", "01", "02", "03", "04"]);
late_selector = contains_selector(["05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]);
// filter_selector = ':contains("00:"), :contains("01:"), :contains("02:"), :contains("03:"), :contains("04:")';
total_jobs = 0;

first_row = $('#pay-stub-rows > tr > td').eq(3);
first_date = first_row.html().split(' ');
console.log('first_date:', first_date);

if (first_date[2] === "") {
    start = first_date[3];
} else {
    start = first_date[2];
}
month = first_date[1];
if (start >= 24 || start <= 8) {
    // period 24th - 8th
    if (start >= 24) {
        eom = monthends[first_date[1]];
        sum_rows(month, start, eom);
        month = months[(new Date(first_date[1] + ' ' + first_date[2] + ' ' + first_date[3]).getMonth()+1)%12];
    }
    sum_rows(month, 1, 9);
} else {
    // period 9th - 23rd
    sum_rows(month, start, 24);
}

new_th = $('<th></th>');
$('#pay-stub-table > tfoot > tr > th').eq(0).attr('colspan', '3').after(new_th);
new_th.html(total_jobs);

inv_time = $('#pay-stub-table > tfoot > tr > th').eq(2).html();
inv_time = inv_time.split(':');
total_min = parseInt(inv_time[1]) + (parseInt(inv_time[0]) * 60);
total_dol = $('#pay-stub-table > tfoot > tr > th').eq(4).html();
inv_rate_avg = (Number(total_dol.substring(1, total_dol.length).replace(',', '')) / total_min).toFixed(2);
$('#pay-stub-table > tfoot > tr > th').eq(3).html('$' + inv_rate_avg);

function contains_selector(arr) {
    retsel = '';
    for (i = 0; i < arr.length; i++) {
        retsel += ':contains("' + arr[i] +':"), ';
    }
    return retsel.substring(0, retsel.length-2);
}

function sum_rows(month, start, end) {
    console.log('sum_rows', month + ' / ' + start + ' / ' + end);
    firstdone = false;
    for (cur_date = start; cur_date < end; cur_date++) {
        selector = 'td:contains(' + month + '):contains( ' + cur_date + ' )';
        next_date = cur_date + 1;
        next_month = month;
        if (cur_date == end && cur_date >= 28) {
            next_date = 1;
            next_month = months[(new Date(first_date[1] + ' ' + first_date[2] + ' ' + first_date[3]).getMonth()+1)%12];
        }
        next_selector = 'td:contains(' + next_month + '):contains( ' + next_date + ' )';
        jobs = 0;
        ratesum = 0;
        moneysum = 0;
        minsum = 0;
        secsum = 0;
        month_date = month + '-' + cur_date;
        new_tr = $('<tr id="day-total-' + month_date + '"><td>-</td><td>-</td><td>-</td><td id="jobs-sum-' + month_date + '">-</td><td id="time-sum-' + month_date + '"></td><td id="rate-avg-' + month_date + '"></td><td id="money-sum-' + month_date + '"></td></tr>');

        function get_row_info(row) {
            curdur = row.next().html();
            dursplit = curdur.split(':');
            durmin = (parseInt(dursplit[0]) * 60) + parseInt(dursplit[1]);
            minsum += durmin;
            dursec = parseInt(dursplit[2]);
            secsum += dursec;
            curmoney = row.next().next().next().html();
            curmoney = curmoney.substring(1, curmoney.length);
            moneysum = moneysum + Number(curmoney);
            // console.log('curmoney', curmoney);
            jobs++;
        }

        if (firstdone === false) {
            sel_filter = early_selector + ', ' + late_selector;
        } else {
            sel_filter = late_selector;
        }

        if ($(selector).filter(sel_filter).length > 0) {
            console.log('rows found for ' + month + ' ' + cur_date + ':', $(selector).length);
            firstdone = true;
            $(selector).filter(sel_filter).each(function(){ get_row_info($(this)); });
        }
        if ($(next_selector).filter(early_selector).length > 0) {
            console.log('rows found early for ' + next_month + ' ' + next_date + ':', $(next_selector).filter(early_selector).length);
            first_done = true;
            $(next_selector).filter(early_selector).each(function() { get_row_info($(this)); });
            $(next_selector).filter(early_selector).last().parent().after(new_tr);
        } else if ($(selector).filter(sel_filter).length > 0) {
            $(selector + ':last').parent().after(new_tr);
        }
        if (jobs > 0) {
            $(new_tr).children().css('background-color', '#555555').css('font-weight', 'bold').css('color', 'white');
            total_jobs += jobs;
            minsum = minsum + Math.floor(secsum / 60);
            rateavg = (moneysum / minsum).toFixed(2);
            durhours = String(Math.floor(minsum / 60));
            durmin = String(minsum % 60);
            dursec = String(secsum % 60);
            total_time = durhours.padStart(2, '0') + ':' + durmin.padStart(2, '0') + ':' + dursec.padStart(2, '0');
            $('#time-sum-' + month_date).html(total_time);
            $('#jobs-sum-' + month_date).html(jobs);
            $('#rate-avg-' + month_date).html('$' + rateavg);
            $('#money-sum-' + month_date).html('$' + moneysum.toFixed(2));
        }
    }
}