// ==UserScript==
// @name         hanime1.me
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://hanime1.me/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cqtvm.com
// @grant        none
// ==/UserScript==

function load(): void {
  const source2: HTMLCollectionOf<HTMLSourceElement> =
    document.getElementsByTagName("source");
  let type: string;
  let src: string;
  let title: string = document
    .getElementsByTagName("h3")[0]
    .innerText // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .split(/[\s\\/?:*<>|]/)
    .join("_");
  if (source2.length) {
    type = "mp4";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    title = title.replaceAll("&", "^&");
    const sources: Array<string> = [];
    const high: Array<number> = [];
    for (let i = 0; i < source2.length; i++) {
      sources.push(source2[i].src);
      high.push(parseInt(source2[i].attributes["size"].value));
    }
    src = sources[high.indexOf(Math.max(...high))]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .replaceAll("&", "^&");
    src = `cd &quot;C:\\Program Files (x86)\\Internet Download Manager&quot; && IDMan.exe /n /d ${src} /f ${title}.mp4`;
  } else {
    type = "m3u8";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    title = title.replaceAll("&", "&quot;&&quot;");
    const input: HTMLInputElement = document.getElementById(
      "video-sd"
    ) as HTMLInputElement;
    src = input.value
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .replaceAll("&", "&quot;&&quot;");
    src = `C:\\Users\\Zm898\\Desktop\\m3u8_sp\\N_m3u8DL-CLI_v3.0.2.exe '${src}' --workDir 'C:\\Users\\Zm898\\Downloads\\Video\\' --saveName '${title}' --maxThreads '8' --minThreads '1' --enableDelAfterDone`;
  }
  document.getElementsByClassName("plyr--full-ui")[0].outerHTML = `
    <input style="font-size: 2.0em; margin: 8em 0 0em 0; padding: 0.5em; width: 40em;" value="${type}" />
    <input style="font-size: 2.0em; margin: 0em 0 0em 0; padding: 0.5em; width: 40em;" value="${src}" />
    <input style="font-size: 2.0em; margin: 0em 0 8em 0; padding: 0.5em; width: 40em;" value="${title}" />
  `;
}

load();
