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

import * as browser from "webextension-polyfill";

// on tab list update
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        // get all rulesets from extension storage
        browser.storage.sync.get().then((rsList) => {
            // iterate through rulesets in extension storage
            for (const [key, value] of Object.entries(rsList)) {
                let ruleset = JSON.parse(value);

                // return if ruleset is disabled
                if (!ruleset._details.enabled) {
                    return;
                }

                // return if source is empty
                if (ruleset._details.src.length <= 0 || ruleset._details.src == undefined || ruleset._details.src == null) {
                    return;
                }

                // return on certain URL types
                if (tab.url.includes("extension://") || tab.url.includes("about:") || tab.url.includes("chrome://")) {
                    return;
                }

                // check if the ruleset URL selector includes this tab's URL
                if (new RegExp(ruleset._details.url.replace(/([.?+^$[\]\\(){}|\/-])/g, "\\$1").replace(/\*/g, ".*")).test(tab.url)) {
                    // script + status message
                    let executee = `console.log("[jSin] Successfully loaded src from ruleset \\"${ruleset._details.name}\\"` +
                        `\\n\\t(\\"${tab.url}\\" matches selector \\"${ruleset._details.url}\\")");\n${ruleset._details.src}`;

                    // execute the script saved for the tab URL
                    browser.tabs.executeScript({
                        code: executee
                    }).then(() => {
                        console.log(`Loaded src from ruleset "${ruleset._details.name}" to URL "${tab.url}" (matches "${ruleset._details.url}")`);
                    }, (error) => {
                        browser.tabs.executeScript({
                            code: `console.error("[jSin] Failed to execute script. More information below...\\n\\n${error}");`
                        });
                        console.error(`Failed to execute script. More information below...\n\n${error}`);
                    });
                }
            }
        }, (error) => {
            console.error(`Failed to retrieve rulesets!\nSee more information below...\n\n${error}`);
        });
    }
});
