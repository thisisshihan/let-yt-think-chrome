// Rewrites outgoing request headers so the server side sees Chrome, not Firefox.

let currentOs = "linux";

browser.runtime.getPlatformInfo().then(info => {
  currentOs = info.os === "win" ? "win" : info.os === "mac" ? "mac" : "linux";
});

browser.webRequest.onBeforeSendHeaders.addListener(
  details => {
    const info = LYTC.OS_INFO[currentOs];
    const headers = details.requestHeaders.filter(h => {
      const n = h.name.toLowerCase();
      // Drop any existing values; we set them below.
      return n !== "user-agent" && !n.startsWith("sec-ch-ua");
    });

    headers.push(
      { name: "User-Agent", value: LYTC.userAgentFor(currentOs) },
      { name: "Sec-CH-UA", value: LYTC.secChUa() },
      { name: "Sec-CH-UA-Mobile", value: "?0" },
      { name: "Sec-CH-UA-Platform", value: `"${info.uaPlatform}"` }
    );

    return { requestHeaders: headers };
  },
  {
    urls: [
      "*://*.youtube.com/*",
      "*://*.youtube-nocookie.com/*",
      "*://*.googlevideo.com/*"
    ]
  },
  ["blocking", "requestHeaders"]
);
