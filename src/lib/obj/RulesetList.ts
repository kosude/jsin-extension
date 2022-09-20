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
    // Add a ruleset to the list and save it to extension storage
    //
    public addRuleset(details: RulesetDetails) {
        let rs = new Ruleset(details);

        // save this new ruleset in extension storage
        rs.save();
    }

    // Update the specified u-list DOM element to show rulesets in extension storage
    //
    public visualise(ul: HTMLUListElement): void {
        this.retrieve().then((rulesetList) => {
            // remove existing children
            ul.replaceChildren();

            // add each ruleset's DOM element to the u-list
            rulesetList.forEach((rs): void => {
                ul.appendChild(rs.element);
            });
        }, (error: string) => {
            console.error(`Failed to display rulesets!\nSee more information below...\n\n${error}`);
        });
    }

    // Return the list of rulesets stored in extension storage.
    //
    public async retrieve(): Promise<Ruleset[]> {
        let rulesets: Ruleset[] = [];

        // get rulesets from extension storage
        await browser.storage.sync.get().then((rsList) => {
            // iterate through rulesets in extension storage
            for (const [key, value] of Object.entries(rsList)) {
                // add each ruleset to the array of rulesets
                rulesets.push(new Ruleset(key));
            }
        }, (error: string) => {
            // promise was rejected
            console.error(`Failed to retrieve rulesets!\nSee more information below...\n\n${error}`);
            return error;
        });

        // return the array of rulesets retrieved from extension storage.
        return rulesets;
    }
}
