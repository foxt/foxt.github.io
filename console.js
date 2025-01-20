export class Console {
    constructor(element) {
        this.container = element;
        this.hhistory = element.querySelector('#history');
        this.inputContainer = element.querySelector('#inputContainer');
        this.prompt = element.querySelector('#prompt');
        this.input = element.querySelector('#input');


        this.container.addEventListener("mouseup", () => {
            this.focus();
        })
        this.input.addEventListener("keydown", () => {
            if (event.keyCode == 13) {
                this.writeHistory(this.prompt.innerText + " " + this.input.value);
                try {
                    this.runCommand(this.input.value.toLowerCase());
                } catch(e) {
                    this.writeHistory(e.toString());
                    this.showInput();
                }
                input.value = '';
            }
        })

        this.showInput()
    }

    runCommand(command) {}

    writeHistory(text) {
        var el = document.createElement('pre');
        el.innerText = text;
        el.className = 'historyElement';
        this.hhistory.appendChild(el);
        this.focus();
    }

    clearHistory() {
        this.hhistory.innerHTML = '';
    }

    setColor(foreColor, backColor) {
        this.container.style.setProperty("--color", foreColor);
        this.container.style.setProperty("--background", backColor);
    }

    focus() {
        this.input.focus();
        this.container.scrollTop = this.container.scrollHeight
    }

    showInput() {
        this.inputContainer.style.display = "flex"
        this.focus()
    }
    hideInput() {
        this.inputContainer.style.display = "none"
    }
}
