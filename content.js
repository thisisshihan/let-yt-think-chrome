// Runs at document_start in every YouTube frame and overrides the browser
// properties that page scripts use to detect the browser.
//
// Uses Firefox's wrappedJSObject / exportFunction so the overrides are applied
// synchronously, before any page script runs, and without inline <script>
// injection (which YouTube's CSP / Trusted Types could block).

console.log("[Let YT think Chrome] content script started on", location.href);

try {
(() => {
  const win = window.wrappedJSObject;
  if (!win || win.__lytcApplied) return;

  const os = LYTC.osFromPlatformString(navigator.platform);
  const info = LYTC.OS_INFO[os];
  const ua = LYTC.userAgentFor(os);

  function defineGetter(target, name, value) {
    const desc = new win.Object();
    desc.get = exportFunction(() => value, win);
    desc.configurable = true;
    desc.enumerable = true;
    win.Object.defineProperty(target, name, desc);
  }

  const proto = win.Navigator.prototype;

  // Classic navigator properties
  defineGetter(proto, "userAgent", ua);
  defineGetter(proto, "appVersion", ua.replace(/^Mozilla\//, ""));
  defineGetter(proto, "vendor", "Google Inc.");

  // navigator.userAgentData (Chromium only; Firefox doesn't have it)
  const brandList = LYTC.brands();
  const uaData = new win.Object();
  uaData.brands = cloneInto(brandList, win);
  uaData.mobile = false;
  uaData.platform = info.uaPlatform;
  uaData.getHighEntropyValues = exportFunction(hints => {
    const result = {
      brands: brandList,
      mobile: false,
      platform: info.uaPlatform,
      platformVersion: info.platformVersion,
      architecture: "x86",
      bitness: "64",
      model: "",
      uaFullVersion: LYTC.CHROME_FULL,
      fullVersionList: brandList.map(b => ({
        brand: b.brand,
        version: b.brand === "Not=A?Brand" ? "24.0.0.0" : LYTC.CHROME_FULL
      })),
      wow64: false
    };
    return win.Promise.resolve(cloneInto(result, win));
  }, win);
  uaData.toJSON = exportFunction(() => cloneInto(
    { brands: brandList, mobile: false, platform: info.uaPlatform }, win
  ), win);
  defineGetter(proto, "userAgentData", uaData);

  // window.chrome stub (some scripts feature-detect Chrome with this)
  if (!win.chrome) {
    win.chrome = cloneInto({ runtime: {}, app: { isInstalled: false } }, win);
  }

  win.__lytcApplied = true;
  console.log("[Let YT think Chrome] overrides applied:", win.navigator.userAgent);
})();
} catch (err) {
  console.error("[Let YT think Chrome] failed to apply overrides:", err);
}
