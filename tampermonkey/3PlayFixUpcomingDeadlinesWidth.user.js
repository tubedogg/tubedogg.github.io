// ==UserScript==
// @name         3Play: Fix Upcoming Deadlines Width
// @namespace    http://idlewords.net
// @version      1.0
// @description  Fix the width of the Upcoming Deadlines box when the zoom of the webpage is reduced below 90%
// @author       You
// @match        https://jobs.3playmedia.com/available_jobs*
// @match        https://jobs.3playmedia.com/assigned_jobs*
// @grant        none
// ==/UserScript==

$("#upcoming_deadlines").css('width', '220px');
$("#current_pay").css('width', '240px');
$("#project_filter_section").css('height', '450px');
$("#project_filters").parent().css('height', '350px');