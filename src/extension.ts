import * as vscode from "vscode";

const BASE_FONT_SIZE = 16;

export function activate(context: vscode.ExtensionContext) {
  console.log("PixelMate activated");

  const decorationType = vscode.window.createTextEditorDecorationType({
    after: {
      color: "#888888",
      fontStyle: "normal",
    },
  });

  function updateDecorations(editor: vscode.TextEditor) {
    const text = editor.document.getText();
    const regex = /(\d*\.?\d+)\s*rem/g;

    const decorations: vscode.DecorationOptions[] = [];

    let match;
    while ((match = regex.exec(text)) !== null) {
      const remValue = parseFloat(match[1]);
      const pxValue = (remValue * BASE_FONT_SIZE).toFixed(2);

      const startPos = editor.document.positionAt(match.index);
      const endPos = editor.document.positionAt(match.index + match[0].length);

      const decoration: vscode.DecorationOptions = {
        range: new vscode.Range(startPos, endPos),
        renderOptions: {
          after: {
            contentText: ` ${pxValue}px`,
          },
        },
      };

      decorations.push(decoration);
    }

    editor.setDecorations(decorationType, decorations);
  }

  vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (editor && event.document === editor.document) {
      updateDecorations(editor);
    }
  });

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      updateDecorations(editor);
    }
  });

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    updateDecorations(activeEditor);
  }
}

export function deactivate() {}
