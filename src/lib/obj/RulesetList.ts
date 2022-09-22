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

import RulesetDetails from "./RulesetDetails";
import Ruleset from "./Ruleset";

// Class to represent a list of rulesets
// Only one of these should actually exist!
//
export default class RulesetList {
    // List of local rulesets
    //
    private _rulesets: Ruleset[];
    public get rulesets() { return this._rulesets; }

    // U-list element to represent ruleset list
    //
    private _ul: HTMLUListElement;
    public get ul() { return this._ul; }

    // Initialise ruleset list class and visualise it
    //
    public constructor(ul: HTMLUListElement) {
        // initialise members
        this._rulesets = [];
        this._ul = ul;
    }

    // Add a local ruleset to the list
    //
    public addRuleset(details: RulesetDetails) {
        this._rulesets.push(new Ruleset(details));
    }

    // Update the specified u-list DOM element to show rulesets in extension storage
    //
    public visualise(): void {
        // remove existing children
        this._ul.replaceChildren();

        // add each ruleset's DOM element to the u-list
        this._rulesets.forEach((ruleset): void => {
            this._ul.appendChild(ruleset.element);
        });
    }

    // Copy all remote rulesets into the local list.
    //
    public async pull(): Promise<void> {
        // get rulesets from extension storage
        await browser.storage.sync.get().then((rsList) => {
            // iterate through rulesets in extension storage
            for (const [key, value] of Object.entries(rsList)) {
                // check if key is undefined
                if (key === "undefined") {
                    console.warn(`Encountered key of "undefined". jSin will attempt to remove this object.
If this keeps happening, you might have found a bug. Please report it at https://github.com/kosude/jsin-extension-2/issues!`);

                    // attempt to remove the problematic key
                    browser.storage.sync.remove(key);

                    continue;
                }

                // add each ruleset to the array of rulesets
                this._rulesets.push(new Ruleset(key));
            }
        }, (error: string) => {
            // promise was rejected
            console.error(`Failed to retrieve rulesets!\nSee more information below...\n\n${error}`);
            return error;
        });
    }

    // Push all local rulesets to remote (extension storage)
    //
    public saveAll(): void {
        this._rulesets.forEach((ruleset): void => {
            ruleset.save();
        });
    };
}
