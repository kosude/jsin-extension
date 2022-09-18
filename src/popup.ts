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

// We can use this to check if this is running on the popup.html page.
// Since webpack will bundle all TS into one JS file, this is worth doing.
//
const PopupContainer: HTMLBodyElement | null = document.querySelector<HTMLBodyElement>("body.popup");

// Add tab-opening functionality to buttons on a popup, which is normally limited with extensions
//
function addOpenTabListener(elementName: string, link: string): void {
    if (PopupContainer == null) {
        return;
    }

    let element = PopupContainer.querySelector<HTMLElement>(`${elementName}`);

    element?.addEventListener("click", (): void => {
        chrome.tabs.create({ url: link });
        // close the popup window
        window.close();
    });
}

if (PopupContainer != null) {
    document.addEventListener("DOMContentLoaded", (): void => {
        // make the appropriate buttons work
        // TODO: update this when the repo merge happens (also update all other references to this URL!!!)
        addOpenTabListener("#ghlogo", "https://github.com/kosude/jsin-extension-2");
        addOpenTabListener("#rulesets-btn", "./dashboard.html");
    });
}
