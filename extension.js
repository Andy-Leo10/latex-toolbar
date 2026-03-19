// @ts-nocheck
const vscode = require('vscode');

// Map of command id -> [opening, closing] LaTeX markup
const WRAPPERS = {
    bold:          ['\\textbf{',        '}'],
    italic:        ['\\textit{',        '}'],
    emph:          ['\\emph{',          '}'],
    monospace:     ['\\texttt{',        '}'],
    underline:     ['\\underline{',     '}'],
    smallcaps:     ['\\textsc{',        '}'],
    section:       ['\\section{',       '}'],
    subsection:    ['\\subsection{',    '}'],
    subsubsection: ['\\subsubsection{', '}'],
    footnote:      ['\\footnote{',      '}'],
};

class LatexToolbarProvider {
    resolveWebviewView(webviewView) {
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html   = this._getHtml();

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
            const sel  = editor.selection;
            const text = editor.document.getText(sel);
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

    _getHtml() {
        return /* html */`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy"
      content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    padding: 8px 6px 16px;
    font-family: var(--vscode-font-family);
    font-size: var(--vscode-font-size);
    color: var(--vscode-foreground);
    background: transparent;
  }

  .group-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.9px;
    opacity: 0.55;
    margin: 12px 0 5px 3px;
  }
  .group-label:first-child { margin-top: 2px; }

  .btn {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 5px 8px;
    margin-bottom: 2px;
    background: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
    border: 1px solid transparent;
    border-radius: 3px;
    cursor: pointer;
    gap: 7px;
    transition: background 0.1s;
  }
  .btn:hover {
    background: var(--vscode-button-secondaryHoverBackground);
    border-color: var(--vscode-focusBorder);
  }
  .btn:active { opacity: 0.75; }

  /* icon column — fixed width so labels align */
  .ico {
    width: 18px;
    text-align: center;
    font-size: 12px;
    flex-shrink: 0;
  }
  .lbl { flex: 1; text-align: left; font-size: 12px; }
  .cmd {
    font-family: var(--vscode-editor-font-family, monospace);
    font-size: 10px;
    opacity: 0.45;
    white-space: nowrap;
  }
</style>
</head>
<body>

<div class="group-label">Énfasis de texto</div>

<button class="btn" onclick="send('bold')">
  <span class="ico"><b>B</b></span>
  <span class="lbl">Negrita</span>
  <span class="cmd">&#92;textbf{}</span>
</button>

<button class="btn" onclick="send('italic')">
  <span class="ico"><i>I</i></span>
  <span class="lbl">Cursiva</span>
  <span class="cmd">&#92;textit{}</span>
</button>

<button class="btn" onclick="send('emph')">
  <span class="ico" style="font-style:italic">E</span>
  <span class="lbl">Énfasis</span>
  <span class="cmd">&#92;emph{}</span>
</button>

<button class="btn" onclick="send('underline')">
  <span class="ico"><u>U</u></span>
  <span class="lbl">Subrayado</span>
  <span class="cmd">&#92;underline{}</span>
</button>

<button class="btn" onclick="send('monospace')">
  <span class="ico" style="font-family:monospace;font-size:11px">M</span>
  <span class="lbl">Monoespaciado</span>
  <span class="cmd">&#92;texttt{}</span>
</button>

<button class="btn" onclick="send('smallcaps')">
  <span class="ico" style="font-variant:small-caps;font-size:10px">SC</span>
  <span class="lbl">Versalitas</span>
  <span class="cmd">&#92;textsc{}</span>
</button>

<div class="group-label">Estructura</div>

<button class="btn" onclick="send('section')">
  <span class="ico">§</span>
  <span class="lbl">Sección</span>
  <span class="cmd">&#92;section{}</span>
</button>

<button class="btn" onclick="send('subsection')">
  <span class="ico" style="font-size:10px">§§</span>
  <span class="lbl">Subsección</span>
  <span class="cmd">&#92;subsection{}</span>
</button>

<button class="btn" onclick="send('subsubsection')">
  <span class="ico" style="font-size:9px">§§§</span>
  <span class="lbl">Subsubsección</span>
  <span class="cmd">&#92;subsubsection{}</span>
</button>

<div class="group-label">Extras</div>

<button class="btn" onclick="send('footnote')">
  <span class="ico" style="font-size:10px;vertical-align:super">fn</span>
  <span class="lbl">Nota al pie</span>
  <span class="cmd">&#92;footnote{}</span>
</button>

<script>
  const vscode = acquireVsCodeApi();
  function send(command) { vscode.postMessage({ command }); }
</script>
</body>
</html>`;
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
