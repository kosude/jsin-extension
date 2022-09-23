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

import * as runner from "../lib/runner";
import RulesetList from "../lib/obj/RulesetList";
import { DashboardLayout, randomiseDashboardEmoticon, setDashboardLayout } from "../lib/layout";
import CodeFlask from "codeflask";
import { initFlask } from "../lib/code";

runner.runOnPage("dashboard", (): void => {
    var rulesetList: RulesetList;
    var codeFlask: CodeFlask;

    document.addEventListener("DOMContentLoaded", (): void => {
        // init codeflask
        codeFlask = initFlask("#code-editor");

        rulesetList = new RulesetList(document.querySelector<HTMLUListElement>(".rulesets > ul")!, codeFlask);

        // wait until the ruleset list is ready
        rulesetList.pull().then((): void => {
            // display it
            rulesetList.visualise();

            // set the dashboard layout according to the amount of rulesets that exist
            if (rulesetList.rulesets.length <= 0) {
                setDashboardLayout(DashboardLayout.NoRulesets);
            } else {
                setDashboardLayout(DashboardLayout.SomeRulesets);
            }
        });

        // add functionality to the 'add ruleset' buttons
        document.querySelectorAll(".create-ruleset-button").forEach((button): void => {
            button.addEventListener("click", (): void => {
                // TODO: bring up edit prompt first
                rulesetList.addRuleset({
                    name: "New ruleset",
                    url: "*google.com*",
                    src: "// Write script here",
                    enabled: true
                });
            });
        });

        // add functionality to the corner logo
        document.querySelector(".corner-logo")!.addEventListener("click", (): void => {
            randomiseDashboardEmoticon();
        });
    });
});
