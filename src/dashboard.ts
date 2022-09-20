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

import * as rs from "./rulesets";

// Since webpack will bundle all TS into one JS file, this is worth doing.
//
const DashboardContainer: HTMLBodyElement | null = document.querySelector<HTMLBodyElement>("body.dashboard");

// Check if on the dashboard page
//
function isDashboard(): boolean {
    return DashboardContainer != null;
}

// Class to represent local dashboard state
//
class Dashboard {
    // List of rulesets
    //
    private _rulesetList: rs.RulesetList;
    public get rulesetList() { return this._rulesetList; }

    // HTML element with which to represent the list of rulesets (_rulesetList)
    //
    private _rulesetListElement: HTMLUListElement;

    public constructor(rulesetListElement: HTMLUListElement) {
        this._rulesetList = new rs.RulesetList;
        this._rulesetListElement = rulesetListElement;

        this._rulesetList.visualise(this._rulesetListElement);
    }

    // Wrapper to add a ruleset to the Dashboard's ruleset list and immediately display this new ruleset
    //
    public addRuleset(details: rs.RulesetDetails): void {
        this._rulesetList.addRuleset(details);
        this.updateRulesetsView();
    }

    // Update the dashboard's ruleset list
    public updateRulesetsView(): void {
        this._rulesetList.visualise(this._rulesetListElement);
    }
}

// Dashboard state instance
//
var dashboardState: Dashboard;

if (isDashboard()) {
    // initialise dashboard state class
    dashboardState = new Dashboard(document.querySelector(".rulesets > ul")!);

    document.addEventListener("DOMContentLoaded", (): void => {
        // add functionality to the 'add ruleset' buttons
        document.querySelectorAll(".create-ruleset-button").forEach((button): void => {
            button.addEventListener("click", (): void => {
                dashboardState.addRuleset({
                    name: "New ruleset",
                    url: "",
                    src: "// Write script here",
                    enabled: true
                });
            });
        });
    });
}
