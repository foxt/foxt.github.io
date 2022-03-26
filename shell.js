import { getCommand } from "./commands/get.js";
import { setColorCommand } from "./commands/setColor.js";
import { Console } from "./console.js";

class ShellConsole extends Console {
    runCommand(command) {
        var args = command.split(' ').filter(x => x != '');
        var command = args[0];
        args.shift();
        switch (command) {
            case 'base64':
                if (args.length == 0) this.writeHistory("Usage: base64 {-d} [string]");
                if (args[0] == "-d") this.writeHistory(atob(args[1]));
                else this.writeHistory(btoa(args.join(" ")));
                break;
            case 'clear':
                this.clearHistory();
                break;
            case 'color':
                setColorCommand(this, args);
                break;                
            case 'echo':
                this.writeHistory(args.join(' '));
                break;
            case 'foxmine':
                document.getElementById('foxsweeper').style.display = 'flex';
                break;
            case 'get':
                getCommand(this, args);
                break;
            case 'help':
                this.writeHistory(
`BASE64      Encodes a string to base64. Use -d to decode.
CLEAR       Clears the console.
COLOR       Sets the default console foreground & background colors.
ECHO        Prints the specified text to the console.
FOXMINE     Starts a new game of minesweeper.
GET         Makes a GET request to the specified URL. (note: CORS is a thing)
HELP        Displays this help message.
UHOH        Uh oh!`);
                break;
            case 'uhoh':
                location.replace("/uhoh.html");
                break;
            case undefined:
                break;
            default:
                this.writeHistory("sh: Command not found: " + command);
                break;
        }
    }
}
window.shellconsole = new ShellConsole( document.getElementById('terminal') );