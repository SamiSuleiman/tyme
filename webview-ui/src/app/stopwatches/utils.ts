export function genId(): string {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 18; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
