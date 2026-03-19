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
    itemize:   ['\\begin{itemize}\n    \\item ', '\n\\end{itemize}'],
    enumerate: ['\\begin{enumerate}\n\t\\item ', '\n\\end{enumerate}'],
    lstlisting: ['\\begin{lstlisting}[style=code, language=Bash, caption={DESCRIPCION}]\n', '\n\\end{lstlisting}'],
    lstinputlisting: ['\\lstinputlisting[style=code, language=Bash, caption={DESCRIPCION}]{RUTA}', ''],
    tcolorbox: ['\\begin{tcolorbox}\n', '\n\\end{tcolorbox}'],
    figure:    ['\\begin{figure}[H]\n\t\\centering\n\t\\includegraphics[width=0.5\\textwidth]{RUTA}\n\t\\caption{DESCRIPCION}\n\\end{figure}', ''],
    figures:   ['\\begin{figure}[H]\n\t\\centering\n\t\\begin{minipage}[b]{0.45\\textwidth}\n\t\t\\centering\n\t\t\\includegraphics[width=\\textwidth]{RUTA}\n\t\\end{minipage}\n\t\\begin{minipage}[b]{0.45\\textwidth}\n\t\t\\centering\n\t\t\\includegraphics[width=\\textwidth]{RUTA}\n\t\\end{minipage}\n\t\\caption{DESCRIPCION}\n\\end{figure}', ''],
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
