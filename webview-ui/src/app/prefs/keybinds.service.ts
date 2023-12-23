import { Injectable, OnDestroy, Renderer2, inject } from "@angular/core";
import { Observable, Subject, filter } from "rxjs";
import { KeybindPressEvent } from "./prefs.model";

@Injectable()
export class KeybindsService implements OnDestroy {
  private readonly renderer = inject(Renderer2);
  private readonly _keybindPressed$ = new Subject<KeybindPressEvent>();

  private dispose: Function;

  constructor() {
    this.dispose = this.renderer.listen("body", "keydown", (e: KeyboardEvent) => {
      const keybind = this.getKeybindFromKeyboardEvent(e);
      if (keybind) this._keybindPressed$.next({ event: e, keybind });
    });
  }

  listenToKeybinds$(toListenTo?: string[]): Observable<KeybindPressEvent> {
    return this._keybindPressed$.pipe(
      filter((pressed) => (toListenTo && !toListenTo.includes(pressed.keybind) ? false : true))
    );
  }

  getKeybindFromKeyboardEvent(event: KeyboardEvent): string | undefined {
    const key =
      event.key === "Alt"
        ? null
        : event.key === "Control"
        ? null
        : event.key === "Meta"
        ? null
        : event.key;

    return !(event.ctrlKey || event.metaKey) || !key
      ? undefined
      : `${event.ctrlKey ? "control." : ""}${event.metaKey ? "meta." : ""}${key}`;
  }

  ngOnDestroy(): void {
    this.dispose();
  }
}
