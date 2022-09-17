// -----------------------------------------------------------------------------
// jSin: Your average JavaScript injector.
// Copyright (c) 2022 Jack Bennett
// -----------------------------------------------------------------------------
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY  KIND,  EXPRESS  OR
// IMPLIED, INCLUDING BUT NOT LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT  SHALL  THE
// AUTHORS OR COPYRIGHT HOLDERS BE  LIABLE  FOR  ANY  CLAIM,  DAMAGES  OR  OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// -----------------------------------------------------------------------------

// Add tab-opening functionality to buttons on a popup, which is normally limited with extensions
//
function addOpenTabListener(elementName: string, link: string): void {
    let element = document.querySelector<HTMLElement>(elementName);

    element?.addEventListener("click", (): void => {
        chrome.tabs.create({ url: link });
        // close the popup window
        window.close();
    });
}

document.addEventListener("DOMContentLoaded", (): void => {
    // make the appropriate buttons work
    // TODO: update this when the repo merge happens#
    addOpenTabListener("#ghlogo", "https://github.com/kosude/jsin-extension-2");
    addOpenTabListener("#rulesets-btn", "./dashboard.html");

    // update the version from the package.json file
    let versionElement = document.querySelector<HTMLSpanElement>("#version");
    if (versionElement != null) {
        versionElement.innerHTML = `v${require("./../package.json").version}`;
    }
});
