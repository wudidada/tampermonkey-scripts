// ==UserScript==
// @name         离场记录
// @namespace    https://jusbin.cn/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sys.iguokao.com/*
// @icon         https://sys.iguokao.com/favicon.ico
// @grant        none
// @require      https://html2canvas.hertzen.com/dist/html2canvas.min.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        let cssObj = {position: 'fixed', top: '50%', right:'5px', 'z-index': 9999}
        let button = document.createElement('button'), btnStyle = button.style;
        button.innerHTML = '离场记录';
        button.onclick = record;
        Object.keys(cssObj).forEach(key => (btnStyle[key] = cssObj[key]))
        document.body.appendChild(button)
    }

    function record() {
        const name = getName();
        const id = getID();
        const reason = getReason();
        getSnapshot().then((snapshot) => copy(name, id, reason, snapshot));
    }


    function getName() {
        const name = document.querySelector(".mb20.name").innerText.trim();
        return item(name);
    }

    function getID() {
        const name = document.querySelectorAll("div.mb10.box1_item")[1].innerText.trim();
        return item(name);
    }

    function getReason() {
        const replies = document.querySelectorAll('.replied');
        let reason = "";
        if (replies && replies.length > 0) {
            const lastReplyTime = replies[replies.length-1].querySelector('.date_text').innerText.slice(11, 16);
            reason = lastReplyTime + " 上厕所";
        }
        return item(reason);
    }

    async function getSnapshot() {
        const canvas = await html2canvas(document.querySelector(".message-info"));
        return item('', `<img src="${canvas.toDataURL()}" />`);
    }

    function item(textContent, htmlContent) {
        htmlContent = htmlContent ? htmlContent : textContent;
        return {textContent, htmlContent}
    }

    function copy(...items) {
        const texts = items.map(({textContent, htmlContent}) => (textContent));
        const textItem = texts.join('\t');

        const htmls = items.map(({textContent, htmlContent}) => (`<td>${htmlContent}</td>`));
        const htmlItem = "<table> <tr>" + htmls.join('') + "</tr> </table>";

        const clipboardItem = new
        ClipboardItem({'text/html':  new Blob([htmlItem],
                                              {type: 'text/html'}),
                       'text/plain': new Blob([textItem],
                                              {type: 'text/plain'})});
        navigator.clipboard.write([clipboardItem]).
        then(_ => console.log("clipboard.write() Ok"),
             error => alert(error));
    }

    addButton();
})();
