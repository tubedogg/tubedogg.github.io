// ==UserScript==
// @name         Torn Auto-Fill Foreign Market Amount
// @namespace    http://idlewords.net/
// @version      0.2
// @description  Auto-fill purchase amount for each item on foreign markets
// @author       You
// @match        https://www.torn.com/*
// @grant        none
// ==/UserScript==

var fillVal = 27;
var bonusType = 'Plushie';
var bonusVal = 32;

$(window).load(function () {
    $("input[id^=item]").each(function(){
        if ($(this).attr('aria-label').search(bonusType) > -1) {
            thisFillVal = bonusVal.toString();
        } else {
            thisFillVal = fillVal.toString();
        }
        $(this).val(thisFillVal);
        $(this).trigger('focusout');
    });
});