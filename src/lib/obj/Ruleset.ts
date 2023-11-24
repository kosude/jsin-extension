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
import { deleteRulesetPrompt, editRulesetPrompt } from "../prompt";
import RulesetDetails from "./RulesetDetails";
import RulesetList from "./RulesetList";
import RulesetPair from "./RulesetPair";

// Class to represent a ruleset
//
export default class Ruleset {
    // HTML element representing this ruleset
    //
    private _element!: HTMLElement;
    public get element() { return this._element; }

    // The ruleset key in extension storage
    //
    private _key!: string;
    public get key() { return this._key; }

    // User details about the ruleset
    //
    private _details!: RulesetDetails;

    // Get/set the 'name' field (in the '_details' object)
    // This updates the ruleset DOM element.
    //
    public get name() { return this._details.name; }
    public set name(val: string) {

        this._details.name = val;

        // as this element should have been created in the constructor, it's generally safe to assume it is not null
        let nameElement: HTMLElement = this._element.querySelector("#name")!;

        nameElement.textContent = val;
        nameElement.title = val;
    }

    // Get/set the 'url' field (in the '_details' object)
    // This updates the ruleset DOM element.
    //
    public get url() { return this._details.url; }
    public set url(val: string) {
        this._details.url = val;

        // as this element should have been created in the constructor, it's generally safe to assume it is not null
        let urlElement: HTMLElement = this._element.querySelector("#url")!;

        urlElement.textContent = val;
        urlElement.title = val;
    }

    // Get/set the 'src' field (in the '_details' object)
    // This updates the ruleset DOM element.
    //
    public get src() { return this._details.src; }
    public set src(val: string) {
        this._details.src = val;
    }

    // Get/set the 'enabled' field (in the '_details' object)
    // This updates the ruleset DOM element.
    //
    public get enabled() { return this._details.enabled; }
    public set enabled(val: boolean) {
        this._details.enabled = val;

        // as this element should have been created in the constructor, it's generally safe to assume it is not null
        let statusElement: HTMLElement = this._element.querySelector("#status")!;

        if (this._details.enabled) {
            statusElement.classList.add("enabled");
            statusElement.classList.remove("disabled");
            statusElement.title = "This ruleset is currently enabled, click to disable.";
        } else {
            statusElement.classList.add("disabled");
            statusElement.classList.remove("enabled");
            statusElement.title = "This ruleset is currently disabled, click to enable.";
        }
    }

    // Initialise a HTML element for the ruleset without any actual details (name, url, etc).
    // To be invoekd in the constructor.
    //
    private initSkeletonHTMLElement(parentList: RulesetList, flask: CodeFlask): HTMLElement {
        // create element as list item
        let element = document.createElement("li");
        element.classList.add("ruleset");

        // edit (pencil) button
        let editBtn = document.createElement("li");
        editBtn.classList.add("material-symbols-outlined");
        editBtn.id = "edit";
        editBtn.title = "Edit this ruleset's properties";
        editBtn.textContent = "edit";
        editBtn.addEventListener("click", (): void => {
            this.promptEdit(parentList, flask);
        });

        // delete (rubbish bin) button
        let delBtn = document.createElement("li");
        delBtn.classList.add("material-symbols-outlined");
        delBtn.id = "delete";
        delBtn.title = "Delete this ruleset";
        delBtn.textContent = "delete";
        delBtn.addEventListener("click", (): void => {
            this.promptDelete(parentList);
        });

        // status (glowing icon) button
        let statusIcon = document.createElement("li");
        statusIcon.id = "status";
        statusIcon.addEventListener("click", (): void => {
            this.enabled = !this.enabled; // this setter will handle editing the DOM to reflect the enabled state
            this.save();
        });

        // append these tools into an unordered list
        let tools = document.createElement("ul");
        tools.appendChild(editBtn);
        tools.appendChild(delBtn);
        tools.appendChild(statusIcon);

        // append this tool list onto the ruleset element
        element.appendChild(tools);

        // return the resulting 'skeleton' element
        return element;
    }

    // Populate a skeleton ruleset list item HTML element with user details about the ruleset
    //
    private populateHTMLElement(element: HTMLElement): HTMLElement {
        let updatedElement = element;

        // name element
        let name = document.createElement("span");
        name.id = "name";

        // URL pattern
        let url = document.createElement("span");
        url.id = "url";

        // add these elements to an 'identifier' section
        let identifier = document.createElement("section");
        identifier.id = "identifier";
        identifier.appendChild(name);
        identifier.appendChild(document.createElement("br")); // line break
        identifier.appendChild(url);

        // append this identifier to the updated element
        updatedElement.appendChild(identifier);

        // return the now-populated (updated) element
        return updatedElement;
    }

    // Generate a key for the ruleset
    //
    private generateKey(): string {
        return Math.random().toString(36).slice(2, 10);
    }

    // Create a ruleset
    // If `details` is a string, it is treated as a key of a ruleset that already exists in extension storage.
    //
    public constructor(details: RulesetDetails | string, parentList: RulesetList, flask: CodeFlask) {
        // initialise the HTML element for the ruleset
        this._element = this.initSkeletonHTMLElement(parentList, flask);
        this._element = this.populateHTMLElement(this._element);

        if (typeof details === "string") {
            if (details === "undefined") {
                console.warn(`Key of "undefined" was passed to a new Ruleset object, which is invalid.`)
                return;
            }

            browser.storage.sync.get(details).then((rsStr) => {
                try {
                    this._key = details;

                    // get basic JSON object from key. this represents the ruleset:
                    let rsObj = JSON.parse(rsStr[details]);

                    // copy data from the JSON object into this object
                    this._details = {
                        name: rsObj._details.name,
                        url: rsObj._details.url,
                        src: rsObj._details.src,
                        enabled: rsObj._details.enabled
                    };

                    // initial run of ruleset details setters to initialise their respective HTML elements
                    // we must run this here so that it is run AFTER getting the data from storage.
                    // otherwise the data will not display.
                    this.name = this.name;
                    this.url = this.url;
                    this.src = this.src;
                    this.enabled = this.enabled;
                } catch (e) {
                    console.error(`Failed to pull a ruleset from extension storage into local object! (key = ${this._key})`)
                    return;
                }
            }, (error: string) => {
                console.error(`Failed to create local ruleset object!\nSee more information below...\n\n${error}`);
            });
        } else {
            // assuming `details` is an object of interface type RulesetDetails
            this._details = details;

            // random key instead of hashing details as multiple rulesets can have the same details
            this._key = this.generateKey();

            // initial run of ruleset details setters to initialise their respective HTML elements
            // NOTE: this is poor form since we could attempt to reuse code from above instead
            this.name = this.name;
            this.url = this.url;
            this.src = this.src;
            this.enabled = this.enabled;
        }
    }

    // Delete the ruleset from extension storage and remove its HTML element
    //
    public delete(): void {
        // delete from extension storage
        browser.storage.sync.remove(this._key).then(() => {
        }, (error: string) => {
            console.error(`Failed to delete ruleset!\nSee more information below...\n\n${error}`);
        });
    }

    // Overwrite data in extension storage with local data in this object.
    //
    public save(): void {
        // create JSON-stringified key-value pair to store ruleset
        // the key (this._key) is built in the constructor.
        let keyPair: RulesetPair = {};
        keyPair[this._key] = JSON.stringify(this);

        // save the new ruleset to extension storage
        browser.storage.sync.set(keyPair).then(() => {
        }, (error: string) => {
            console.error(`Failed to save ruleset!\nSee more information below...\n\n${error}`);
        });
    }

    // Prompt the user to edit the ruleset
    //
    public promptEdit(parentList: RulesetList, flask: CodeFlask): void {
        editRulesetPrompt(this, parentList, flask);
    }

    // Prompt the user to delete the ruleset
    //
    public promptDelete(parentList: RulesetList): void {
        deleteRulesetPrompt(this, parentList);
    }
}
