// ==UserScript==
// @name         www.wnacg.org
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.wnacg.org/*-index-aid-*.html
// @match        *://www.wnacg.org/*-index-page-*-aid-*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

const lp: Location = window.location;

const host: string = lp.host;
const pathname: string = lp.pathname;

interface KeyHandleFunction {
  (
    ctrl: boolean,
    alt: boolean,
    shift: boolean,
    key: string,
    ev: KeyboardEvent
  ): void;
}

function PushKeypress(funs: Array<KeyHandleFunction>) {
  window.addEventListener("keyup", function (ev: KeyboardEvent) {
    const ctrl: boolean = ev.ctrlKey;
    const alt: boolean = ev.altKey;
    const shift: boolean = ev.shiftKey;
    const key: string = ev.key;
    let fun: KeyHandleFunction;
    for (let i = 0; i < funs.length; i++) {
      fun = funs[i];
      fun(ctrl, alt, shift, key, ev);
    }
  });
}

function KeypressFin(ev: KeyboardEvent) {
  ev.preventDefault();
  ev.stopPropagation();
}

if (host === "www.wnacg.org") {
  const m1: RegExpMatchArray | null = pathname.match(
    /\/photos(-index(?:-page-\d+|)-aid-\d+\.html)/
  );
  if (m1 !== null) {
    PushKeypress([
      function (
        ctrl: boolean,
        alt: boolean,
        shift: boolean,
        key: string,
        ev: KeyboardEvent
      ): void {
        if (ctrl && !alt && !shift) {
          if (key === "q") {
            KeypressFin(ev);
            window.open(`/download${m1![1]}`, "_self");
          }
        }
      },
    ]);
  }
  const m2 = pathname.match(/\/download(-index(?:-page-\d+|)-aid-\d+\.html)/);
  if (m2 !== null) {
    PushKeypress([
      function (
        ctrl: boolean,
        alt: boolean,
        shift: boolean,
        key: string,
        ev: KeyboardEvent
      ): void {
        if (ctrl && !alt && !shift) {
          if (key === "q") {
            KeypressFin(ev);
            const a: HTMLAnchorElement = document.getElementsByClassName(
              "down_btn"
            )[0] as HTMLAnchorElement;
            a.click();
          }
        }
      },
    ]);
  }
}
