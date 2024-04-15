import { Disposable, Webview, Uri, commands } from "vscode";
import { getUri } from "../../utils/getUri";
import { getNonce } from "../../utils/getNonce";

export function getWebviewContentWithLoginForm(
  webview: Webview,
  extensionUri: Uri,
) {
  const webviewUri = getUri(webview, extensionUri, [
    "out",
    "client",
    "webview",
    "apps",
    "lightspeed",
    "explorer",
    "main.js",
  ]);
  const styleUri = getUri(webview, extensionUri, ["media", "style.css"]);
  const nonce = getNonce();

  return /*html*/ `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="${styleUri}">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
      <title>Ansible Lightspeed Explorer!</title>
    </head>
    <body>
    Welcome to Ansible Lightspeed for Visual Studio Code.\nExperience smarter automation using Ansible Lightspeed with watsonx Code Assistant solutions for your playbook. <a href="https://www.redhat.com/en/engage/project-wisdom">Learn more</a><br />Let's simplify your workflow by connecting VS Code with Ansible Lightspeed.<br />
    <form id="playbook-explanation-form">
      <div class="component-container">
        <section class="component-section">
          <vscode-button id="lightspeed-explorer-connect">Connect</vscode-button>
        </section>
      </section>
      <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
    </form>
    </body>
  </html>
        `;
}

export function getWebviewContentWithActiveSession(
  webview: Webview,
  extensionUri: Uri,
  userName: string,
  userType: string,
  userRole: string,
  has_playbook_opened: boolean,
) {
  const webviewUri = getUri(webview, extensionUri, [
    "out",
    "client",
    "webview",
    "apps",
    "lightspeed",
    "explorer",
    "main.js",
  ]);
  const styleUri = getUri(webview, extensionUri, ["media", "style.css"]);
  const nonce = getNonce();

  return /*html*/ `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
        webview.cspSource
      }; script-src 'nonce-${nonce}';">
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="${styleUri}">
      <title>Ansible Lightspeed Explorer!</title>
    </head>
    <body>

    Logged in as: ${userName}<br />
    User Type: ${userType}<br />
    Role: ${userRole}<br />

    <div class="button-container">
    <form id="playbook-explanation-form">
      <vscode-button id="lightspeed-explorer-playbook-explanation-submit" ${
        has_playbook_opened ? "" : "disabled"
      }>Explain the current playbook</vscode-button>
    <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
    </form>
    </div>
    </body>
  </html>
        `;
}

export function setWebviewMessageListener(
  webview: Webview,
  disposables: Disposable[] = [],
) {
  webview.onDidReceiveMessage(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (message: any) => {
      console.log(
        `Lightspeed explorer - Message received: ${JSON.stringify(message)}}`,
      );
      const command = message.command;

      switch (command) {
        case "connect":
          commands.executeCommand("ansible.lightspeed.oauth");
          return;
        case "explain":
          commands.executeCommand("ansible.lightspeed.playbookExplanation");
          return;
      }
    },
    undefined,
    disposables,
  );
}