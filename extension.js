// @ts-nocheck
const vscode = require('vscode');
const fs     = require('fs');
const path   = require('path');

// Map of command id -> [opening, closing] LaTeX markup
const WRAPPERS = {
    bold:      ['\\textbf{',    '}'],
    italic:    ['\\textit{',    '}'],
    monospace: ['\\texttt{',    '}'],
    underline: ['\\underline{', '}'],
    footnote:  ['\\footnote{',  '}'],
};

class LatexToolbarProvider {
    resolveWebviewView(webviewView) {
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = fs.readFileSync(
            path.join(__dirname, 'toolbar.html'), 'utf8'
        );

        webviewView.webview.onDidReceiveMessage(({ command }) => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showWarningMessage('LaTeX Toolbar: no hay editor activo.');
                return;
            }
            if (editor.document.languageId !== 'latex') {
                vscode.window.showWarningMessage(
                    'LaTeX Toolbar: el archivo activo no es un documento LaTeX (.tex).'
                );
                return;
            }

            const pair = WRAPPERS[command];
            if (!pair) return;

            const [open, close] = pair;
            const sel     = editor.selection;
            const text    = editor.document.getText(sel);
            const wrapped = open + text + close;

            editor.edit(eb => eb.replace(sel, wrapped)).then(() => {
                // If nothing was selected, place cursor inside the braces
                if (text === '') {
                    const newPos = sel.start.translate(0, open.length);
                    editor.selection = new vscode.Selection(newPos, newPos);
                }
            });
        });
    }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const provider = new LatexToolbarProvider();
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('latexToolbar.view', provider)
    );
}

function deactivate() {}

module.exports = { activate, deactivate };
