// ==UserScript==
// @name         www.trxs.me
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.trxs.me/*
// @match        *://www.trxs.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trxs.me
// @grant        none
// ==/UserScript==

const p: string = window.location.pathname;
if (/^\/tags-\d+-\d+\.html$/g.test(p)) {
  bookStyleLoad();
  bookPN();
} else if (/^\/tongren\/(?:index_\d+\.html)?$/g.test(p)) {
  bookStyleLoad();
  bookPN();
} else if (/\/tongren\/\d+\/\d+.html/g.test(p)) {
  chapterPN();
}

function bookStyleLoad(): void {
  const bk: HTMLCollectionOf<Element> = document.getElementsByClassName("bk");

  for (let i = 0; i < bk.length; i++) {
    const element: Element = bk[i];

    const a: HTMLAnchorElement = element.firstElementChild as HTMLAnchorElement;
    const url: string = a.href;

    const pic: Element = a.firstElementChild!;

    const info: Element = a.lastElementChild!;

    const h3: Element = info.firstElementChild!;
    const booknew: Element = h3.nextElementSibling!;
    const p: Element = info.lastElementChild!;

    element.innerHTML = `
            <a href = ${url}>${pic.outerHTML}</a>
            <div class="infos">
                <a href = ${url} style="width: fit-content;">${h3.outerHTML}</a>
                <a href = ${url}>${booknew.outerHTML}</a>
                <a href = ${url}>${p.outerHTML}</a>
            </div>
        `;
  }
}

function bookPN(): void {
  const b: HTMLElement = document.getElementsByTagName("b")[1];
  window.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (!ev.ctrlKey && !ev.altKey && !ev.shiftKey) {
      const key = ev.key;
      if (key === "a") {
        (<HTMLButtonElement>b.previousElementSibling).click();
      } else if (key == "d") {
        (<HTMLButtonElement>b.nextElementSibling).click();
      }
    }
  });
}

function chapterPN(): void {
  const pageNav: HTMLDivElement = <HTMLDivElement>(
    document.getElementsByClassName("pageNav")[0]
  );
  const m: RegExpMatchArray = pageNav.textContent!.match(/(\d+)\/(\d+)/)!;
  const preview: boolean = m[1] === "1";
  const next: boolean = m[1] === m[2];
  window.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (!ev.ctrlKey && !ev.altKey && !ev.shiftKey) {
      const key = ev.key;
      if (key === "a") {
        if (preview) {
          // space
        } else if (next) {
          (<HTMLAnchorElement>pageNav.children[1]).click();
        } else {
          (<HTMLAnchorElement>pageNav.children[1]).click();
        }
      } else if (key == "d") {
        if (preview) {
          (<HTMLAnchorElement>pageNav.children[1]).click();
        } else if (next) {
          // space
        } else {
          (<HTMLAnchorElement>pageNav.children[2]).click();
        }
      }
    }
  });
}
