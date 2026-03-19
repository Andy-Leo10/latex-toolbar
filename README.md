# LaTeX Toolbar

Barra de herramientas lateral para formatear documentos LaTeX en VS Code.

## Instalación

La extensión se instala localmente (sin Marketplace). Para reinstalarla en otro equipo:

```bash
# 1. Copiar los 3 archivos fuente a una carpeta temporal
mkdir -p /tmp/latex-toolbar-vsix/extension
cp ~/.vscode/extensions/sinso.latex-toolbar-0.0.1/{package.json,extension.js,icon.svg} /tmp/latex-toolbar-vsix/extension/

# 2. Crear los archivos de manifiesto VSIX (ver más abajo)

# 3. Empaquetar e instalar
cd /tmp/latex-toolbar-vsix && zip -r ../latex-toolbar-0.0.1.vsix .
code --install-extension /tmp/latex-toolbar-0.0.1.vsix --force
```

## Uso

1. Abre un archivo `.tex` en VS Code.
2. Haz clic en el icono **T** de la barra de actividad (panel lateral izquierdo).
3. Selecciona texto en el editor y pulsa el botón del formato deseado.

> La extensión solo actúa sobre archivos con `languageId === 'latex'`.

## Buttons

| Icon | LaTeX command | Description |
|---|---|---|
| **B** | `\textbf{...}` | Bold |
| *I* | `\textit{...}` | Italic |
| `</>` | `\texttt{...}` | Monospace |
| U̲ | `\underline{...}` | Underline |
| • — | `\begin{itemize}` | Bullet list |
| 1. — | `\begin{enumerate}` | Numbered list |
| `</>` | `\begin{lstlisting}` | Inline code block |
| 📄`</>` | `\lstinputlisting{...}` | External code file |
| ▐□ | `\begin{tcolorbox}` | Colored note box |
| 🏔 | `\begin{figure}` | Single figure |
| 🏔🏔 | `\begin{minipage}` | Two side-by-side figures |
| fn¹ | `\footnote{...}` | Footnote |

## Archivos de la extensión

```
sinso.latex-toolbar-0.0.1/
├── extension.js       ← lógica principal (activación, wrapping de texto)
├── toolbar.html       ← interfaz de la barra lateral (botones, estilos)
├── package.json       ← manifiesto de la extensión (comandos, vistas, icono)
├── icon.svg           ← icono de la barra de actividad (forma de T)
├── .vsixmanifest      ← generado automáticamente al instalar el .vsix
└── README.md          ← este archivo
```

## Modificar la extensión

Edita directamente los archivos en `~/.vscode/extensions/sinso.latex-toolbar-0.0.1/`.  
Después, recarga VS Code con **Ctrl+Shift+P → Developer: Reload Window** para aplicar cambios.

- **Cambiar la apariencia** (botones, estilos, layout): edita `toolbar.html`.
- **Añadir un nuevo comando**: edita `extension.js` y `toolbar.html`.

Para agregar un nuevo botón:

1. Añade una entrada en `WRAPPERS` dentro de `extension.js`:
   ```js
   'nombre_id': ['\\comando{', '}'],
   ```
2. Añade el botón en `toolbar.html`:
   ```html
   <button class="btn" onclick="send('nombre_id')">
     <span class="ico">X</span>
     <span class="lbl">Descripción</span>
     <span class="cmd">&#92;comando{}</span>
   </button>
   ```
