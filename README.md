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

## Botones disponibles

| Botón | Comando LaTeX | Resultado |
|---|---|---|
| **B** | `\textbf{...}` | Negrita |
| *I* | `\textit{...}` | Cursiva |
| `TT` | `\texttt{...}` | Monoespaciado |
| U̲ | `\underline{...}` | Subrayado |
| `\comment{...}` | Tachado (paquete `changes`) | ~~texto~~ |
| `\section{...}` | Sección | Sección |
| `\subsection{...}` | Subsección | Subsección |
| `\subsubsection{...}` | Sub-subsección | Sub-subsección |
| `\textcolor{red}{...}` | Color rojo | Texto en rojo |
| `\label{...}` | Etiqueta de referencia | — |
| `\ref{...}` | Referencia | — |
| `\cite{...}` | Cita bibliográfica | — |

## Archivos de la extensión

```
sinso.latex-toolbar-0.0.1/
├── extension.js       ← lógica principal (activación, webview, wrapping)
├── package.json       ← manifiesto de la extensión (comandos, vistas, icono)
├── icon.svg           ← icono de la barra de actividad (forma de T)
├── .vsixmanifest      ← generado automáticamente al instalar el .vsix
└── README.md          ← este archivo
```

## Modificar la extensión

Edita directamente los archivos en `~/.vscode/extensions/sinso.latex-toolbar-0.0.1/`.  
Después, recarga VS Code con **Ctrl+Shift+P → Developer: Reload Window** para aplicar cambios.

Para agregar un nuevo botón, edita `extension.js`:

1. Añade una entrada en el objeto `WRAPPERS`:
   ```js
   'nombre_boton': ['&#92;comando{', '}'],
   ```
2. Añade el botón correspondiente en la función `getHtml()` dentro de `resolveWebviewView`.
