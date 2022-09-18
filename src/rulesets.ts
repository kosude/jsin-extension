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

// User details about a ruleset
//
interface RulesetDetails {
    // Ruleset name
    //
    name: string;

    // URL to deploy the ruleset on
    //
    url: string;

    // Ruleset source
    //
    src: string;

    // Whether or not the ruleset is enabled
    //
    enabled: boolean;
}

// Class to represent a list of rulesets
// Only one of these should actually exist!
//
class RulesetList {
    // List of ruleset items
    //
    public rulesets: Ruleset[] = [];

    // Add a ruleset to the list via either its class representation
    //
    public addRulesetListItem(ruleset: Ruleset): void {
        this.rulesets.push(ruleset);
    }
}

// Class to represent a ruleset
//
class Ruleset {
    // HTML element representing this ruleset
    //
    private _element!: HTMLElement;
    public get element() { return this._element; }

    // The ruleset list that holds this ruleset
    //
    private _parentList: RulesetList;
    public get parentList() { return this._parentList; }

    // User details about the ruleset
    //
    private _details: RulesetDetails;
    public get details() { return this._details; }

    // The ruleset key in extension storage
    //
    private _key: any;
    public get key() { return this._key; }

    // Initialise a HTML element for the ruleset without any actual details (name, url, etc).
    // To be invoekd in the constructor.
    //
    private initSkeletonHTMLElement(): HTMLElement {
        // create element as list item
        let element = document.createElement("li");
        element.classList.add("ruleset");

        // edit (pencil) button
        let editBtn = document.createElement("li");
        editBtn.classList.add("material-symbols-outlined");
        editBtn.id = "edit";
        editBtn.title = "Edit this ruleset's properties";
        editBtn.innerHTML = "edit";
        editBtn.addEventListener("click", (): void => {
            // NOT_IMPLEMENTED: call the edit-ruleset prompt
        });

        // delete (rubbish bin) button
        let delBtn = document.createElement("li");
        delBtn.classList.add("material-symbols-outlined");
        delBtn.id = "delete";
        delBtn.title = "Delete this ruleset";
        delBtn.innerHTML = "delete";
        delBtn.addEventListener("click", (): void => {
            // NOT_IMPLEMENTED: call the delete-ruleset prompt
        });

        // status (glowing icon) button
        let statusIcon = document.createElement("li");
        statusIcon.id = "status";
        statusIcon.addEventListener("click", (): void => {
            // NOT_IMPLEMENTED: toggle status
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
        name.innerHTML = this._details.name;
        name.title = this._details.name;

        // URL pattern
        let url = document.createElement("span");
        url.id = "url";
        url.innerHTML = this._details.url;
        url.title = this._details.url

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

    // Create a ruleset
    //
    public constructor(parentList: RulesetList, details: RulesetDetails) {
        this._parentList = parentList;
        this._details = details;

        // random key instead of hashing details as multiple rulesets can have the same details
        this._key = Math.random().toString(36).slice(2, 10);

        // save the new ruleset to extension storage
        let keyPair = { key: JSON.stringify(this) };
        // chrome.storage.sync.set(keyPair).then(() => {
            // initialise the HTML element for the ruleset
            this._element = this.initSkeletonHTMLElement();
            this._element = this.populateHTMLElement(this._element);

            // append the HTML element to the list of rulesets in the DOM
            document.querySelector(".rulesets > ul")!.appendChild(this._element);
        // }, (error: string) => {
        //     console.error(`Failed to create new ruleset!\nSee more information below...\n\n${error}`);
        // });
    }

    // Delete the ruleset from extension storage and remove its HTML element
    //
    public delete() {
        // delete from extension storage
        // chrome.storage.sync.remove(this._key).then(() => {
            // remove HTML element
            this.element.remove();

            // remove from the parent list
            this._parentList.rulesets.splice(this._parentList.rulesets.indexOf(this), 1);
        // }, (error: string) => {
        //     console.error(`Failed to delete ruleset!\nSee more information below...\n\n${error}`);
        // })
    }
}

let testList: RulesetList = new RulesetList();
let test: Ruleset = new Ruleset(testList, { name: "test ruleset", url: "testurl", src: "dsjfk", enabled: true });
let test2: Ruleset = new Ruleset(testList, { name: "test ruleset", url: "testurl", src: "dsjfk", enabled: true });
let test3: Ruleset = new Ruleset(testList, { name: "test ruleset", url: "testurl", src: "dsjfk", enabled: true });
