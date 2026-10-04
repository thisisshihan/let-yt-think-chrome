// Shared configuration, loaded by both the background script and the content script.
// To update the spoofed Chrome version, change CHROME_MAJOR (and CHROME_FULL) here.

var LYTC = (() => {
  const CHROME_MAJOR = "154";
  const CHROME_FULL = "154.0.0.0";

  // "Not A Brand" GREASE entry, same shape real Chrome sends.
  const GREASE_BRAND = { brand: "Not=A?Brand", version: "24" };

  // Pick an OS token that matches the real OS so the spoof stays consistent.
  function osFromPlatformString(p) {
    p = (p || "").toLowerCase();
    if (p.startsWith("win")) return "win";
    if (p.startsWith("mac")) return "mac";
    return "linux";
  }

  const OS_INFO = {
    win: { token: "Windows NT 10.0; Win64; x64", uaPlatform: "Windows", platformVersion: "10.0.0" },
    mac: { token: "Macintosh; Intel Mac OS X 10_15_7", uaPlatform: "macOS", platformVersion: "15.0.0" },
    linux: { token: "X11; Linux x86_64", uaPlatform: "Linux", platformVersion: "6.0.0" }
  };

  function userAgentFor(os) {
    return `Mozilla/5.0 (${OS_INFO[os].token}) AppleWebKit/537.36 (KHTML, like Gecko) ` +
      `Chrome/${CHROME_FULL} Safari/537.36`;
  }

  function brands() {
    return [
      { brand: "Chromium", version: CHROME_MAJOR },
      GREASE_BRAND,
      { brand: "Google Chrome", version: CHROME_MAJOR }
    ];
  }

  function secChUa() {
    return brands().map(b => `"${b.brand}";v="${b.version}"`).join(", ");
  }

  return { CHROME_MAJOR, CHROME_FULL, OS_INFO, osFromPlatformString, userAgentFor, brands, secChUa };
})();
