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
import { DashboardLayout, setDashboardLayout } from "../layout";
import CodeFlask from "codeflask";

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

    // CodeFlask element
    //
    private _flask: CodeFlask;
    public get flask() { return this._flask; }

    // Initialise ruleset list class and visualise it
    //
    public constructor(ul: HTMLUListElement, flask: CodeFlask) {
        // initialise members
        this._rulesets = [];
        this._ul = ul;
        this._flask = flask;
    }

    // Add a synced ruleset to the list
    //
    public addRuleset(details: RulesetDetails) {
        let rs = new Ruleset(details, this, this._flask);
        rs.save();

        this._rulesets.push(rs);

        // append ruleset element to the list
        this._ul.appendChild(rs.element);

        // if this was the first ruleset to be created, then set dashboard layout accordingly
        if (this._rulesets.length === 1) {
            setDashboardLayout(DashboardLayout.SomeRulesets);
        }
    }

    // Remove a synced ruleset from the list
    //
    public removeRuleset(ruleset: Ruleset) {
        let index = this._rulesets.indexOf(ruleset);

        if (index < 0) {
            console.warn("Attempted to remove ruleset from a list that doesn't contain it");
            return;
        }

        // delete from extension storage
        ruleset.delete();

        // remove HTML element
        ruleset.element.remove();

        // remove from local array
        this._rulesets.splice(index, 1);

        // if this was the only remaining ruleset, then set layout accordingly
        if (this._rulesets.length <= 0) {
            setDashboardLayout(DashboardLayout.NoRulesets);
        }
    }

    // Update the specified u-list DOM element to show rulesets in extension storage
    //
    public visualise(): void {
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
                this._rulesets.push(new Ruleset(key, this, this._flask));
            }
        }, (error: string) => {
            // promise was rejected
            console.error(`Failed to retrieve rulesets!\nSee more information below...\n\n${error}`);
            return error;
        });
    }
}
