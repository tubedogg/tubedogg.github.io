// ==UserScript==
// @name         IBB Link Image
// @namespace    http://idlewords.net
// @version      0.1
// @description  Change IBB links to point to the full image
// @author       You
// @match        https://ibb.co/*
// @grant        none
// ==/UserScript==

var imgsrc1 = $('body > script').first().text();
imgsrc1 = imgsrc1.split(',url:\"https://i.ibb.co/')[1];
imgsrc1 = imgsrc1.substr(0, imgsrc1.search('"'));
imgsrc1 = 'https://i.ibb.co/' + imgsrc1;
// $('#image-viewer-container > img').wrap('<a href="' + imgsrc1 + '"></a>');
// $('#image-viewer-container').removeClass();
window.location.href = imgsrc1;