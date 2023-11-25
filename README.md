<img src="./resources/jsin/jsin.svg" align=left>


# jSin: your average JavaScript injector

[![MIT Licence](https://img.shields.io/github/license/kosude/jsin-extension-2)](./LICENCE)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/jsin-extension)](https://addons.mozilla.org/en-GB/firefox/addon/jsin-extension/)

jSin (or JSIN; **J**ava**S**cript **IN**jector) is a simple, free-and-open-source JavaScript injector extension. It aims to be as simple and
minimal as possible.

**For Firefox users, this extension is available on the
[Mozilla add-ons store](https://addons.mozilla.org/en-GB/firefox/addon/jsin-extension/).** Otherwise, it still works on Chromium-based browsers -
just download the corresponding version from the latest release and install it as a local extension in your browser.

See the [build instructions](BUILD.md) for method of reproducing the distributable code.


### jSin will not be published to the Chrome Web Store

Even if jSin works on Chrome when locally installed, unfortunately it cannot be submitted for publication on the Chrome Web Store due to
regulations on [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/) which require adblockers and JavaScript injectors to break,
via its way of just *not implementing* APIs required by these extensions, including jSin. There was a *chance* before, when Manifest V2 was still
supported, but now thats gone too.

Best advice is to uninstall Chrome and install a good browser instead, like Firefox. Otherwise, maintenance on jSin for Chrome is unfortunately
halted, pretty much. (Maybe someone way smarter than me will find a workaround for it!!)
