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
