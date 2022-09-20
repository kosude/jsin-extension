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
import RulesetList from "./RulesetList";

// Class to represent local dashboard state
//
export default class Dashboard {
    // List of rulesets
    //
    private _rulesetList: RulesetList;
    public get rulesetList() { return this._rulesetList; }

    // HTML element with which to represent the list of rulesets (_rulesetList)
    //
    private _rulesetListElement: HTMLUListElement;

    public constructor(rulesetListElement: HTMLUListElement) {
        this._rulesetList = new RulesetList;
        this._rulesetListElement = rulesetListElement;

        this._rulesetList.visualise(this._rulesetListElement);
    }

    // Wrapper to add a ruleset to the Dashboard's ruleset list and immediately display this new ruleset
    //
    public addRuleset(details: RulesetDetails): void {
        this._rulesetList.addRuleset(details);
        this.updateRulesetsView();
    }

    // Update the dashboard's ruleset list
    public updateRulesetsView(): void {
        this._rulesetList.visualise(this._rulesetListElement);
    }
}
