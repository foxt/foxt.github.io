var colorMap = {
    '0': '#000000',
    '1': '#070072',
    '2': '#007618',
    '3': '#007574',
    '4': '#750005',
    '5': '#760072',
    '6': '#74761A',
    '7': '#C0C0C0',
    '8': '#757575',
    '9': '#1600F8',
    'a': '#00FF35',
    'b': '#00FFFF',
    'c': '#FF0012',
    'd': '#FF00F9',
    'e': '#FFFF38',
    'f': '#FFFFFF'
}

export function setColorCommand(console,args) {
    var m = (args[0] || "").toLowerCase().match(/^[0-9a-f]{2}$/);
    if (m) {
        m = m[0]
        console.setColor(colorMap[m[0]], colorMap[m[1]]);
    } else {
        console.writeHistory(
`Sets the default console foreground & background colors.
Usage: color [attr]
Where attr specifies color attribute of color output.

Color attributes are specified by TWO hex digits -- the first corresponds to the background; the second is the foreground.
Each digit can be any of the following:
    0 = Black           8 = Grey
    1 = Blue            9 = Light Blue
    2 = Green           A = Light Green
    3 = Aqua            B = Light Aqua
    4 = Red             C = Light Red
    5 = Purple          D = Light Purple
    6 = Yellow          E = Light Yellow
    7 = White           F = Bright White
`)
    }
}