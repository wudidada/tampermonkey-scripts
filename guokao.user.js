// ==UserScript==
// @name         guokao
// @namespace    https://jusbin.cn/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sys.iguokao.com/*
// @icon         https://sys.iguokao.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';

    //let history = [];
    let history = new Set();

    setInterval(refresh, 1000);

    function refresh() {
        const msgCnt = getMessageCount();
        notify(msgCnt);
    }

    function getMessageCount() {
        let cnt = 0;
        let currMsgs = new Set();
        for(let msg of document.querySelectorAll(".cand-list>.cand-item")) {
            const msgHash = hash(msg);
            currMsgs.add(msgHash);
        }

        let newMsgs = new Set([...currMsgs].filter(x => !history.has(x)));
        history = currMsgs;
        return newMsgs.size;
    }

    function hash(item) {
        return item.innerText.replace('未回复', '已回复');
    }

    function notify(cnt) {
        if (cnt > 0) {
            GM_notification({
                text: `${cnt}条新问题`,
                title: "国考云",
                timeout: 3000
            });}
    }
})();
