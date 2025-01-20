export function getCommand(console, args) {
    var url = args[0];
    if (!url) {
        console.writeHistory("Usage: get [url]");
        return;
    }
    console.hideInput();
    fetch(url).then(response => response.text()).then(text => {
        console.writeHistory(text)
        console.showInput();
    }).catch(error => {
        console.writeHistory("Error: " + error);
        console.showInput();
    })
}