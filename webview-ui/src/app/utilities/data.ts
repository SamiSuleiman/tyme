import { Observable, filter, fromEvent, map, take } from "rxjs";
import { vscode } from "./vscode";

class Data {
  get$<T>(path: string): Observable<T> {
    const evt = fromEvent(window, "message").pipe(
      take(1),
      filter((msg: any) => msg.data.path === path),
      map((msg) => msg.data.payload)
    );
    vscode.postMessage({ cmd: "get", payload: { path } });
    return evt;
  }

  set<T>(path: string, val: T) {
    vscode.postMessage({ cmd: "set", payload: { path, val } });
  }
}

export const data = new Data();
