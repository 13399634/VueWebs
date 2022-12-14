// ==UserScript==
// @name         www.55tvb.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.55tvb.com/addons/dplayer/?url=https://a.ak-kk.com/*/*/index.m3u8
// @icon         https://www.google.com/s2/favicons?sz=64&domain=55tvb.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const search: string = location.search;
  const m3u8: string = search.substring(search.indexOf("https://"));
  for (let i = 0; i < 10; i++) {
    console.log("url", m3u8);
    console.log("");
  }
  // Your code here...
})();
