# Let YT think Chrome

A small, open-source Firefox add-on that makes YouTube see your browser as Google Chrome.

It spoofs, on `youtube.com`, `youtube-nocookie.com` and `googlevideo.com` only:

- the `User-Agent` request header
- the `Sec-CH-UA`, `Sec-CH-UA-Mobile` and `Sec-CH-UA-Platform` Client Hints headers
- `navigator.userAgent`, `navigator.appVersion`, `navigator.vendor`
- `navigator.userAgentData` (including `getHighEntropyValues()`)
- a minimal `window.chrome` object

The OS part of the spoofed UA matches your real OS (Windows, macOS or Linux), so the values stay consistent.

## Install (development)

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select `manifest.json` from this folder

Temporary add-ons are removed when Firefox restarts. For a permanent install, submit it to [addons.mozilla.org](https://addons.mozilla.org/developers/) (or use Firefox Developer/Nightly/ESR with `xpinstall.signatures.required` set to `false`).

## Build

```sh
npm install --global web-ext
web-ext lint
web-ext build
```

The packaged add-on is written to `web-ext-artifacts/`.

## Configuration

Edit `config.js` to change the spoofed Chrome version (`CHROME_MAJOR`, `CHROME_FULL`). Keep it close to the current stable Chrome release.

Before publishing, change the add-on ID (`browser_specific_settings.gecko.id`) and `homepage_url` in `manifest.json` to your own.

## Limitations

- This is not undetectable. Firefox and Chrome differ in many ways (JS engine behavior, WebGL/canvas fingerprints, supported codecs, API surface). A site determined to tell them apart can.
- Spoofing can occasionally break things if a site serves Chrome-only code paths that rely on features Firefox lacks.
- Only YouTube domains are affected; other sites see the normal Firefox identity.

## Contributing

Issues and pull requests are welcome. Ideas: a toolbar toggle, a per-OS override, an options page for the Chrome version.

## License

MIT. See [LICENSE](LICENSE).
