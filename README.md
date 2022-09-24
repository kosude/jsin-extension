<img src="./resources/jsin/jsin.svg" align=left>

# jSin: your average JavaScript injector

[![MIT Licence](https://img.shields.io/github/license/kosude/jsin-extension-2)](./LICENCE)

jSin (or JSIN; **J**ava**S**cript **IN**jector) is a simple, free-and-open-source JavaScript injector extension.
It aims to be as simple and minimal as possible.

## Original version of jSin

This is technically jSin v2, since the project was originally written in basic HTML, CSS and JavaScript, and has since been rewritten to use
TypeScript and Sass instead of JavaScript and CSS respectively. This was done to make development more bearable, so I can actually work on it in
the future, since this original codebase was abhorrent.

Since the first version, Node.js has been implemented to make it easier to 1. manage packages and 2. compile different versions for Chromium and
Firefox separately. This makes it easier to transition to Manifest V3.

Because the project was completely rewritten but the frontend is still basically the same as the original (at the time of first release), this
won't actually be called 'jSin v2' but the original project will essentially (ideally?) be completely forgotten (it's not accessible anymore anyways).

### Ruleset support

**Rulesets created with the original version of jSin will still be in extension storage, but aren't compatible with this version of it. So make sure to
save the scripts before deleting the original extension if you downloaded it.**

## jSin will not be published on the Chrome Web Store

To publish extensions to the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions), you need to register as a
"Chrome Web Store Developer". This requires developers to be of a certain age (probably 18), which is fine. However, I would need to
give Google my ID in order to verify this. which is never gonna happen.

The Firefox equivalent does not seem to need this information, so the extension will hopefully be put on there eventually.
