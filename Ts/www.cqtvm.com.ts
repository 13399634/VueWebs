// ==UserScript==
// @name         www.cqtvm.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.cqtvm.com/vodplay/*-*-*.html
// @match        *://www.mzxwz.com/vodplay/*-*-*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cqtvm.com
// @grant        none
// ==/UserScript==

const keystr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function getUtf8(e: string): string {
  let d = "";
  let i: number;
  let o: number;
  let c: number;
  let y: number;
  let b = 0;
  for (; b < e.length; b++) {
    i = e.charCodeAt(b);
    if (i < 128) {
      d += String.fromCharCode(i);
    } else if (i < 224) {
      o = e.charCodeAt(++b);
      d += String.fromCharCode(((31 & i) << 6) | (63 & o));
    } else if (i < 240) {
      o = e.charCodeAt(++b);
      c = e.charCodeAt(++b);
      d += String.fromCharCode(((15 & i) << 12) | ((63 & o) << 6) | (63 & c));
    } else {
      o = e.charCodeAt(++b);
      c = e.charCodeAt(++b);
      y = e.charCodeAt(++b);
      d += String.fromCharCode(
        ((7 & i) << 18) | ((63 & o) << 12) | ((63 & c) << 6) | (63 & o)
      );
    }
  }
  return d;
}

function getDecode(e: string): string {
  let d = 0;
  let i = "";
  let o: number;
  let c: number;
  let y: number;
  let b: number;
  let p: number;
  let m: number;
  let w: number;
  e = e.replace(/[^A-Za-z\d+/=]/g, "undefined");
  e = e.substring(3);
  for (; d < e.length; ) {
    b = keystr.indexOf(e.charAt(d++));
    p = keystr.indexOf(e.charAt(d++));
    m = keystr.indexOf(e.charAt(d++));
    w = keystr.indexOf(e.charAt(d++));
    o = (b << 2) | (p >> 4);
    c = ((15 & p) << 4) | (m >> 2);
    y = ((3 & m) << 6) | w;
    i += String.fromCharCode(o);
    if (64 != m) {
      i += String.fromCharCode(c);
    }
    if (64 != w) {
      i += String.fromCharCode(y);
    }
  }
  return getUtf8(i);
}

function core() {
  const host: string = window.location.host;
  if (host === "www.mzxwz.com") {
    const iFrame = document.getElementById("playleft")!
      .firstElementChild! as HTMLIFrameElement;
    const src: string = iFrame.src;
    const o: string = src.substring(src.lastIndexOf("https://"));
    iFrame.parentElement!.parentElement!.parentElement!.parentElement!.parentElement!.parentElement!.outerHTML = `<input style="font-size: 2.0em; margin: 8em 0; padding: 0.5em; width: 30em;" value="${o}" />`;
    console.log(o);
  } else if (host === "www.cqtvm.com") {
    const iFrame: HTMLIFrameElement = document.getElementById(
      "fed-play-iframe"
    )! as HTMLIFrameElement;
    const play: string = iFrame.dataset["play"]!;
    const pass: string = iFrame.dataset["pass"]!;
    const stat: string = iFrame.dataset["stat"]!;
    const d: string = "0" === pass ? play : getDecode(play);
    const o: string =
      "0" !== stat && -1 < d.indexOf("&") ? encodeURIComponent(d) : d;
    iFrame.parentElement!.outerHTML = `<input style="font-size: 2.0em; margin: 8em 0; padding: 0.5em; width: 30em;" value="${o}" />`;
    console.log(o);
  } else {
    throw new SyntaxError("");
  }
}

core();
