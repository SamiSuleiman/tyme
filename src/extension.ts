import { commands, ExtensionContext } from "vscode";
import { TymePanel } from "./panels/TymePanel";
import { LocalStorageService } from "./utilities/localStorageService";

export function activate(context: ExtensionContext) {
  let storageManager = new LocalStorageService(context.globalState);

  context.subscriptions.push(
    commands.registerCommand("tyme.show", () => {
      TymePanel.render(context.extensionUri, storageManager);
    })
  );
}
