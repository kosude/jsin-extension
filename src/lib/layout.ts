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

// Amount of dashboard emoticons available
//
export const DashboardEmoticonCount = 11;

// Types of dashboard layouts
//
export enum DashboardLayout {
    NoRulesets,
    SomeRulesets
}

// Set dashboard layout
// kaomojiIndex is only necessary if type is NoRulesets
//
export function setDashboardLayout(type: DashboardLayout, kaomojiIndex?: number) {
    switch (type) {
        case DashboardLayout.NoRulesets:
            let rulesets = document.querySelector<HTMLDivElement>(".rulesets")!;
            let cornerLogo = document.querySelector<HTMLDivElement>(".corner-logo")!;

            // hide the normal rulesets list and allow action on the corner logo
            rulesets.classList.add("empty");
            cornerLogo.classList.remove("no-action");

            // give the corner logo a title
            cornerLogo.title = "Click me for +* kaomoji +*"

            // randomise the emoticon image
            randomiseDashboardEmoticon();

            break;
        case DashboardLayout.SomeRulesets:
            // show the normal rulesets list and disable mouse action on the corner logo
            document.querySelector<HTMLDivElement>(".rulesets")!.classList.remove("empty");
            document.querySelector<HTMLDivElement>(".corner-logo")!.classList.add("no-action");

            break;
        default:
            console.warn("Dashboard layout invalid type");

            break;
    }
}

// Update the emoticon element
//
export function setDashboardEmoticon(index: number) {
    let emoticon = document.querySelector<HTMLImageElement>("#emoticon")!;

    // set the emoticon to the specified kaomoji svg
    emoticon.src = `./emoticon/${index}.svg`;

    // animate the emoticon after being changed
    emoticon.classList.add("animated");
    setTimeout(() => {
        emoticon.classList.remove("animated");
    }, 200);
}

// Randomise the emoticon element
//
export function randomiseDashboardEmoticon() {
    setDashboardEmoticon(Math.floor(Math.random() * DashboardEmoticonCount));
}
