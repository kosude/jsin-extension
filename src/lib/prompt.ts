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
import { getFlaskElement, updateFlaskContent } from "./code";
import Ruleset from "./obj/Ruleset";
import RulesetList from "./obj/RulesetList";

// Show a prompt or modal
//
export function showModal(modal: HTMLDivElement): void {
    modal.classList.remove("closing");
    modal.classList.add("show");
}

// Hide a prompt or modal
//
export function hideModal(modal: HTMLDivElement): void {
    modal.classList.add("closing");

    // wait for the fade-out animation (initiated above) to complete
    setTimeout(() => {
        // hide modal
        modal.classList.remove("show");
    }, 100);
}

// Open the 'edit ruleset' prompt
//
export function editRulesetPrompt(ruleset: Ruleset, parentList: RulesetList, flask: CodeFlask, onClose: (saved: boolean) => void = () => {}): void {
    // get edit prompt
    let modal = document.querySelector<HTMLDivElement>("#edit-prompt")!;

    // buffer boolean to hold the ruleset enabled/disabled status, as set in this dialogue.
    // this is done so that the background indicator is not changed if the user doesn't save the changes to the status.
    let statusBuffer = ruleset.enabled;

    // function to switch tab
    // 'tab' is the name of the tab to switch to
    //
    function switchTab(tab: string): void {
        // deselect all other tab buttons
        Array.from(modal.querySelector<HTMLDivElement>(".modal-tabs")!.children).forEach((t) => {
            if (tab !== t.classList[0]) {
                t.classList.remove("current");
            } else {
                t.classList.add("current");
            }
        });

        // hide all other tabs
        Array.from(modal.querySelectorAll<HTMLDivElement>(".edit-tab")!).forEach((t) => {
            if (t !== modal.querySelector(`#tab-${tab.replace("tab", "")}`)) {
                t.style.display = "none";
            } else {
                t.style.removeProperty("display");
            }
        });

        // add appropriate class to the modal content element
        Array.from(modal.querySelector<HTMLDivElement>(".modal-content")!.classList).forEach((c) => {
            modal.querySelector(".modal-content")!.classList.add(tab.replace("tab", ""));
            if (c !== tab.replace("tab", "") && c !== "modal-content") {
                modal.querySelector(".modal-content")!.classList.remove(c);
            }
        });

        if (tab === "sourcetab") {
            // simulate a scroll every time the flask comes into view to eliminate a visual bug
            getFlaskElement(flask)!.querySelector("textarea")!.dispatchEvent(new MouseEvent("scroll"));
        }
    }

    // make tab buttons work
    Array.from(modal.querySelector(".modal-tabs")!.children).forEach((tab) => {
        tab.addEventListener("click", () => {
            switchTab(tab.classList[0]);
        });
    });

    // go to the general tab by default
    switchTab("generaltab");

    // display modal
    modal.classList.remove("closing"); // disable closing animation
    modal.style.display = "flex";

    // initialise content

    //
    // GENERAL TAB:
    //

    let generalTab = modal.querySelector("#tab-general")!;

    // set key display appropriately
    generalTab.querySelector("#keydisplay")!.textContent = `ruleset key: ${ruleset.key}`;

    // disable name newlines
    generalTab.querySelector<HTMLTextAreaElement>("#name textarea")!.addEventListener("input", (e) => {
        generalTab.querySelector<HTMLTextAreaElement>("#name textarea")!.value =
            generalTab.querySelector<HTMLTextAreaElement>("#name textarea")!.value.replace(/\n/g, "");
    });

    // get name
    generalTab.querySelector<HTMLTextAreaElement>("#name textarea")!.value = ruleset.name;

    // get enabled status
    if (statusBuffer) {
        generalTab.querySelector("#status")!.classList.add("enabled");
        generalTab.querySelector("#status")!.classList.remove("disabled");
        generalTab.querySelector("#status div")!.textContent = "ENABLED";
    } else {
        generalTab.querySelector("#status")!.classList.add("disabled");
        generalTab.querySelector("#status")!.classList.remove("enabled");
        generalTab.querySelector("#status div")!.textContent = "DISABLED";
    }

    // add functionality to the ENABLED/DISABLED button in the general tab
    // (first removing all old event listeners from the div)
    generalTab.querySelector("#status div")!.replaceWith(generalTab.querySelector("#status div")!.cloneNode(true));

    generalTab.querySelector("#status div")!.addEventListener("click", () => {
        // this immediately updates the ruleset rather than being put into a buffer
        // we just directly modify the ruleset to achieve this
        statusBuffer = !statusBuffer;

        // re-run this code so that the button's appearance is updated.
        if (statusBuffer) {
            generalTab.querySelector("#status")!.classList.add("enabled");
            generalTab.querySelector("#status")!.classList.remove("disabled");
            generalTab.querySelector("#status div")!.textContent = "ENABLED";
        } else {
            generalTab.querySelector("#status")!.classList.add("disabled");
            generalTab.querySelector("#status")!.classList.remove("enabled");
            generalTab.querySelector("#status div")!.textContent = "DISABLED";
        }
    });

    //
    // SOURCE TAB:
    //

    // update flask contents
    updateFlaskContent(flask, ruleset);

    //
    // URL TAB:
    //

    let urlTab = modal.querySelector("#tab-url")!;

    // disable newlines
    urlTab.querySelector<HTMLTextAreaElement>("#entry textarea")!.addEventListener("input", (e) => {
        urlTab.querySelector<HTMLTextAreaElement>("#entry textarea")!.value =
            urlTab.querySelector<HTMLTextAreaElement>("#entry textarea")!.value.replace(/\n/g, "");
    });

    // get URL
    urlTab.querySelector<HTMLTextAreaElement>("#entry textarea")!.value = ruleset.url;

    //
    // NON-TABS:
    //

    // add functionality to the cancel button (do nothing and exit)
    modal.querySelector(".quitbtn")!.replaceWith(modal.querySelector(".quitbtn")!.cloneNode(true));
    modal.querySelector(".quitbtn")!.addEventListener("click", () => {
        // close the dialogue
        modal.classList.add("closing");
        // wait for the fade-out animation (initiated above) to complete
        setTimeout(() => {
            modal.style.display = "none";
        }, 100);

        onClose(false);
    });

    // add functionality to the save button
    modal.querySelector(".savebtn")!.replaceWith(modal.querySelector(".savebtn")!.cloneNode(true));
    modal.querySelector(".savebtn")!.addEventListener("click", () => {
        // save changes to the ruleset now
        ruleset.name = generalTab.querySelector<HTMLTextAreaElement>("#name textarea")!.value;
        ruleset.url = urlTab.querySelector<HTMLTextAreaElement>("#entry textarea")!.value;
        ruleset.src = flask.getCode();
        ruleset.enabled = statusBuffer;

        // sync these changes to extension storage
        ruleset.save();

        // update the ruleset list to reflect these changes
        parentList.visualise();

        // close the dialogue
        modal.classList.add("closing");
        // wait for the fade-out animation (initiated above) to complete
        setTimeout(() => {
            modal.style.display = "none";
        }, 100);

        onClose(true);
    });
}

// Open the 'delete ruleset' prompt
//
export function deleteRulesetPrompt(ruleset: Ruleset, parentList: RulesetList): void {
    // get and show modal
    let modal = document.querySelector<HTMLDivElement>("#delete-prompt")!;
    showModal(modal);

    // get modal buttons
    let cancelBtn = document.querySelector<HTMLButtonElement>(".cancelbtn")!;
    let continueBtn = document.querySelector<HTMLButtonElement>(".continuebtn")!;

    // remove old event listeners from buttons
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
    continueBtn.replaceWith(continueBtn.cloneNode(true));

    // we need to re-get the elements as otherwise adding new event listeners doesn't work for some reason
    cancelBtn = document.querySelector<HTMLButtonElement>(".cancelbtn")!;
    continueBtn = document.querySelector<HTMLButtonElement>(".continuebtn")!;

    // add functionality to the cancel button
    cancelBtn.addEventListener("click", (): void => {
        hideModal(modal);
    });

    // add functionality to the cancel button
    continueBtn.addEventListener("click", (): void => {
        hideModal(modal);

        // remove via parent so that it is automatically removed from the interface
        parentList.removeRuleset(ruleset);
    });
}
