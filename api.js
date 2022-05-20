const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let url = params.url;

if (url) {
  let loadingLink = document.getElementById("url");
  loadingLink.href = url;
  loadingLink.innerText = url;
  fetch(`https://api.codetabs.com/v1/proxy?quest=${url}`)
    .then(async (response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      let htmlDoc = parser.parseFromString(html, "text/html");
      let fontStyle = document.createElement("style");
      fontStyle.innerText = `* {font-family: "Comic Sans", "Comic Sans MS", "Chalkboard", "ChalkboardSE-Regular", sans-serif !important;}`;
      htmlDoc.head.appendChild(fontStyle);

      const links = htmlDoc.getElementsByTagName("a");
      for (const element of links) {
        let href = element.getAttribute("href");
        if (href) {
          if (href.startsWith("/") && !href.startsWith("//")) {
            element.href = `http://${location.hostname + location.pathname}?url=http://${
              new URL(url).hostname + href
            }`;
          } else if (
            !(href.startsWith("https://") && href.startsWith("https://"))
          ) {
            element.href = `http://${location.hostname + location.pathname}?url=http://${
              new URL(url).hostname + "/" + href
            }`;
          } else {
            element.href = `http://${location.hostname + location.pathname}?url=${href}`;
          }
        }
      }

      const elements = [
        ...htmlDoc.getElementsByTagName("img"),
        ...htmlDoc.getElementsByTagName("video"),
        ...htmlDoc.getElementsByTagName("script"),
      ];
      for (const element of elements) {
        let src = element.getAttribute("src");
        if (src && !src.startsWith("//")) {
          if (src.startsWith("/")) {
            element.src = `http://${new URL(url).hostname + src}`;
          } else if (
            !(src.startsWith("https://") && src.startsWith("https://"))
          ) {
            element.src = `http://${new URL(url).hostname + "/" + src}`;
          }
        }
      }

      const stylesheets = htmlDoc.querySelectorAll('link[rel="stylesheet"]');
      for (const element of stylesheets) {
        let href = element.getAttribute("href");
        console.log(href)
        if (href && !href.startsWith("//")) {
          if (href.startsWith("/")) {
            element.href = `http://${new URL(url).hostname + href}`;
          } else if (
            !(href.startsWith("https://") && href.startsWith("https://"))
          ) {
            element.href = `http://${new URL(url).hostname + "/" + href}`;
          }
        }
      }

      document.open();
      document.write(htmlDoc.documentElement.innerHTML);
      document.close();
    });
}
