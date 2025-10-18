# **GITHUB_JS_HTML_for_Beginners**

This guide is for **non-developers** who want to contribute to the CECG project or create their own customized fork. You don’t need to be a programmer — you just need to understand how to edit text files and use GitHub’s built-in tools.

---

## **Section 1 – GitHub Collaboration Guide**

### **Overview**
GitHub is where we store and track our project files (like `README.md`, `.json`, `.js`, and `.html`). Every file you edit or add is versioned, so others can review and merge your updates safely.

### **Common Tasks**

#### **1. Editing Markdown Files (like README.md)**
Markdown (`.md`) files are formatted text files that GitHub renders beautifully. You can use them to write documentation, tutorials, or notes.

Example task:
- Improve explanations or add links in the `README.md` file.
- Add new documentation like `COMPONENTS.md` or `JS_HTML_Concepts.md`.

#### **2. Creating Links Between Markdown Files**
You can link to other `.md` files in the repository by using:
```markdown
[Link text](./filename.md)
```
Example:
```markdown
For a breakdown of code structure, see [Components & Repo Structure](./COMPONENTS.md).
```

#### **3. Branching and Pull Requests**
When you make changes in GitHub:
1. Click **✏️ Edit this file** in the file view.
2. When done, choose **Create a new branch for this commit and start a pull request.**
3. Click **Propose changes**.
4. Review your edits, then **Create pull request**.

Other collaborators will see your pull request, review, and approve before merging.

#### **Example Tasks You Can Do:**
- Detail sections of the README or add examples.
- Add diagrams or concept illustrations.
- Link markdowns for navigation.
- Proofread and rewrite documentation for clarity.

*(See also: “Collaboration Methodology” from `Github Collaboration Guide.docx` for the complete process.)*

---

## **Section 2 – Key Concepts**

### **PWA (Progressive Web App)**
This project is a **PWA**, which means:
- It’s made of files in a **folder** that can run in **any browser** — on a phone, tablet, laptop, or desktop.
- It doesn’t matter if your device uses an **x86**, **ARM**, or **RISC** chip — if it has a modern browser, it works.
- You can **download** the project folder and open `index.html` to run it offline.

There’s **no data saved automatically** — it’s a “click to generate” system. If you want to save your output:
- Copy and paste the generated text.
- Or use your browser’s **Print → Save as PDF** option.

---

### **Basics of Web Apps**
A web app consists of these core file types:
- **HTML:** The structure or skeleton of the page.
- **CSS:** The design and layout (colors, fonts, alignment).
- **JS (JavaScript):** The logic or behavior of the app.
- **Images:** Icons, backgrounds, and art assets.

---

### **Objects in JavaScript**
An **object** is a container for information. Think of it as a character sheet in the form of data.

**Example:**
```js
let character = {
  name: "Tessa Kael",
  age: 22,
  race: "Human",
  abilities: { Str: 7, Dex: 8, End: 6, Int: 9, Edu: 8, Soc: 6 },
  careers: [ { name: "Scout", terms: 2, rank: 1 } ],
  status: "Knight"
};
```
Each property (like `name` or `abilities`) stores part of the character’s information.

Objects can also contain **arrays** (lists) and **numbers**, and even other **objects** inside them.

---

### **Properties, Strings, Arrays, Numbers**
- **String:** Text in quotes (`"Human"`)
- **Number:** Numeric value (`6`)
- **Array:** A list of values (`[1, 2, 3]` or `["Scout", "Merchant"]`)
- **Object:** A group of key-value pairs (`{ name: "Tessa", age: 22 }`)

---

### **JSON and JS Modules**
JSON (JavaScript Object Notation) is how we store data for modules like backgrounds, races, and careers.

**Example:**
```json
{
  "scout": {
    "enlist": { "target": 7 },
    "survival": { "target": 5 },
    "skills": ["Pilot", "Navigation", "Mechanic"]
  }
}
```
JavaScript reads these JSON files to know how to generate your character’s story.

---

### **RNG (Random Number Generator)**
RNG is used to simulate dice rolls in games.

**Example Script:**
```js
function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// Roll 2 six-sided dice
let roll = rollDice(6) + rollDice(6);
console.log(`You rolled a ${roll}!`);
```
You can test this directly in your browser.

---

### **Testing Scripts in the Browser**
To test JavaScript quickly:
1. Open any webpage (or your local `index.html`).
2. Press **F12** (or right-click → *Inspect Element* → *Console*).
3. Paste the script above and press **Enter**.
4. You’ll see the dice roll result appear in the console.

You can try editing the script — change the sides, roll more dice, or create simple functions to simulate other random events.

---

### **Next Steps for Beginners**
- Try cloning or forking the repository to your GitHub.
- Edit small `.md` files first.
- Test basic scripts in the console.
- Explore how JSON data interacts with JavaScript.
- Gradually move to modifying small JS files or creating your own data modules.

