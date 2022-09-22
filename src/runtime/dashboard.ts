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

runner.runOnPage("dashboard", (): void => {
    var rulesetList: RulesetList;

    document.addEventListener("DOMContentLoaded", (): void => {
        rulesetList = new RulesetList(document.querySelector<HTMLUListElement>(".rulesets > ul")!);

        // wait until the ruleset list is ready and then visualise it
        rulesetList.pull().then((): void => { rulesetList.visualise(); })

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
                rulesetList.visualise();
            });
        });
    });

    // save all rulesets before the page is unloaded
    window.addEventListener("beforeunload", (): void => {
        // FIXME: saving has been disabled for now (see issue #3 on GH)
        // rulesetList.saveAll();
    });
});
