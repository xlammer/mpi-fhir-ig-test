window.addEventListener('load', () => {
  import('https://cdn.jsdelivr.net/npm/pako@2.1.0/+esm').then(({default: pako}) => {
    document.querySelectorAll('pre.language-plantuml').forEach((el, idx) => {
      const codeElement = el.firstChild;
      const umlCode = codeElement.innerText;
      const imgUrl = composePlantUmlUrl(umlCode);
      fetch(imgUrl).then(r => r.text()).then(svg => el.outerHTML = `<figure class="plantuml">${svg}</figure>`)
    })


  function composePlantUmlUrl(umlCode) {
    const server = 'https://www.plantuml.com/plantuml';
    const zippedCode = encode64(pako.deflate('@startuml' + '\n' + umlCode + '\n@enduml'));
    return `${server}/svg/~1${zippedCode}`;
  }
  
  function encode64(data) {
    let r = "";
    for (let i = 0; i < data.length; i += 3) {
      if (i + 2 === data.length) {
        r += append3bytes(data[i], data[i + 1], 0);
      } else if (i + 1 === data.length) {
        r += append3bytes(data[i], 0, 0);
      } else {
        r += append3bytes(data[i], data[i + 1],
          data[i + 2]);
      }
    }
    return r;
  }
  
  function append3bytes(b1, b2, b3) {
    let c1 = b1 >> 2;
    let c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    let c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
    let c4 = b3 & 0x3F;
    let r = "";
    r += encode6bit(c1 & 0x3F);
    r += encode6bit(c2 & 0x3F);
    r += encode6bit(c3 & 0x3F);
    r += encode6bit(c4 & 0x3F);
    return r;
  }
  
  function encode6bit(b) {
    if (b < 10) {
      return String.fromCharCode(48 + b);
    }
    b -= 10;
    if (b < 26) {
      return String.fromCharCode(65 + b);
    }
    b -= 26;
    if (b < 26) {
      return String.fromCharCode(97 + b);
    }
    b -= 26;
    if (b === 0) {
      return '-';
    }
    if (b === 1) {
      return '_';
    }
    return '?';
  }
  
})
});