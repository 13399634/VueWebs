enum PasteButtonLineIdType {
  top = "top",
  h3 = "h3",
  h4 = "h4",
  line = "line",
  html = "html",
}

interface PasteButtonTextType {
  text: string;
  html: string;
  code: boolean;
}

interface PasteButtonLineType {
  pasteButtonLineIdType: PasteButtonLineIdType;
  text: Array<string | PasteButtonTextType>;
  html: string;
}

class IPasteButtonTextType implements PasteButtonTextType {
  text = "";
  code = false;

  get html(): string {
    return `<span${this.code === true ? "class='code'" : ""}>${
      this.text
    }</span>`;
  }

  constructor(data?: { text?: string; code?: boolean }) {
    if (data !== undefined) {
      if (data?.code) {
        this.code = data.code;
      }
      if (data?.text) {
        this.text = data.text;
      }
    }
  }
}

class IPasteButtonLineType implements PasteButtonLineType {
  pasteButtonLineIdType: PasteButtonLineIdType = PasteButtonLineIdType.line;
  text: Array<string | PasteButtonTextType> = [""];

  get html(): string {
    const innerHtmls: Array<string> = [];
    for (let i = 0; i < this.text.length; i++) {
      const p: string | PasteButtonTextType = this.text[i];
      if (typeof p === "string") {
        innerHtmls.push(p);
      } else {
        innerHtmls.push(p.html);
      }
    }
    const innerHtml: string = innerHtmls.join("");
    let top: string;
    let bottom: string;
    switch (this.pasteButtonLineIdType) {
      case PasteButtonLineIdType.top:
        top = "<p class='top'>";
        bottom = "</p>";
        break;
      case PasteButtonLineIdType.h3:
        top = "<p class='h3'>";
        bottom = "</p>";
        break;
      case PasteButtonLineIdType.h4:
        top = "<p class='h4'>";
        bottom = "</p>";
        break;
      case PasteButtonLineIdType.line:
        top = "<p class='line'>";
        bottom = "</p>";
        break;
      case PasteButtonLineIdType.html:
        top = "";
        bottom = "";
        break;
    }
    return `${top}${innerHtml}${bottom}`;
  }

  constructor(data?: {
    type?: PasteButtonLineIdType;
    text?: Array<string | PasteButtonTextType> | PasteButtonTextType | string;
  }) {
    if (data !== undefined) {
      if (data?.type) {
        this.pasteButtonLineIdType = data.type;
      }
      if (data?.text) {
        if (data.text instanceof Array) {
          this.text = data.text;
        } else {
          this.text = [data.text];
        }
      }
    }
  }
}

export {
  PasteButtonLineIdType,
  PasteButtonLineType,
  IPasteButtonLineType,
  PasteButtonTextType,
  IPasteButtonTextType,
};
