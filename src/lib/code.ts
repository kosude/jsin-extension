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

import CodeFlask from "codeflask";
import Ruleset from "./obj/Ruleset";

// List of flasks created so that their elements can be retrieved
// key = the element selector
//
var flasks = Object.create(null);

// Initialise and return a CodeFlask object attached to the given element
//
export function initFlask(elementSelector: string): CodeFlask {
    let r = new CodeFlask(elementSelector, {
        language: "js",
        lineNumbers: true,
        readonly: false,
        defaultTheme: false,
        tabSize: 4
    });

    // add this flask to the flasks dictionary
    flasks[elementSelector] = r;

    return r;
}

// Update the flask element's content with the source code in the given ruleset
//
export function updateFlaskContent(flask: CodeFlask, ruleset: Ruleset) {
    flask.updateCode(ruleset.src);
}

// Get the element attached to a flask
//
export function getFlaskElement(flask: CodeFlask): HTMLElement | null {
    // get element selector from flasks dictionary
    let elementSelector = Object.keys(flasks).find(key => flasks[key] === flask);

    if (elementSelector == null || elementSelector == undefined) {
        console.warn("Flask element not found from flask");
        return null;
    }

    // return the DOM representative of this element
    return document.querySelector<HTMLElement>(elementSelector)!;
}
