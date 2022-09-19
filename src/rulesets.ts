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

// Class to represent a ruleset
//
class Ruleset {
    // HTML element representing this ruleset
    //
    private _element!: HTMLElement;
    public get element() { return this._element; }

    // The ruleset key in extension storage
    //
    private _key: any;
    public get key() { return this._key; }

    // User details about the ruleset
    //
    private _details: RulesetDetails;

    // Get/set the 'name' field (in the '_details' object)
    // This updates the ruleset DOM element.
    //
    public get name() { return this._details.name; }
    public set name(val: string) {
        this._details.name = val;

        // as this element should have been created in the constructor, it's generally safe to assume it is not null
        let nameElement: HTMLElement = this._element.querySelector("#name")!;

        nameElement.innerHTML = val;
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

        urlElement.innerHTML = val;
        urlElement.title = val;
    }

    // Get/set the 'src' field (in the '_details' object)
    // This updates the ruleset DOM element.
    //
    public get src() { return this._details.url; }
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
            this.enabled = !this.enabled; // this setter will handle editing the DOM to reflect the enabled state
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

    // Create a ruleset
    //
    public constructor(details: RulesetDetails) {
        this._details = details;

        // random key instead of hashing details as multiple rulesets can have the same details
        this._key = Math.random().toString(36).slice(2, 10);

        let keyPair = { key: JSON.stringify(this) };

        // save the new ruleset to extension storage
        browser.storage.sync.set(keyPair).then(() => {
        }, (error: string) => {
            console.error(`Failed to create new ruleset!\nSee more information below...\n\n${error}`);
        });

        // initialise the HTML element for the ruleset
        this._element = this.initSkeletonHTMLElement();
        this._element = this.populateHTMLElement(this._element);

        // initial run of ruleset details setters to initialise their respective HTML elements
        this.name = this.name;
        this.url = this.url;
        this.src = this.src;
        this.enabled = this.enabled;
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
    public addRuleset(ruleset: Ruleset | RulesetDetails): void {
        if (ruleset instanceof Ruleset) {
            this.rulesets.push(ruleset);
        } else {
            this.rulesets.push(new Ruleset(ruleset));
        }
    }

    // Update the specified u-list DOM element to show the rulesets that are part of this list
    //
    public visualise(ul: HTMLUListElement): void {
        // remove existing children
        ul.replaceChildren();

        // add each ruleset's DOM element to the u-list
        this.rulesets.forEach((rs): void => {
            ul.appendChild(rs.element);
        });
    }
}

let list = new RulesetList();
list.addRuleset({ name: "test name", url: "test url", src: "test source", enabled: true });
list.visualise(document.querySelector<HTMLUListElement>(".rulesets > ul")!);
