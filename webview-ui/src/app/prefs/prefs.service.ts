import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, filter, shareReplay, tap } from "rxjs";
import { data } from "../utilities/data";
import { Prefs, defaultPrefs } from "./prefs.model";

@Injectable()
export class PrefsService {
  private readonly _prefs$ = new BehaviorSubject<Prefs | undefined>(undefined);
  readonly prefs$ = this._prefs$.pipe(
    filter((prefs): prefs is Prefs => !!prefs),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor() {
    this.get$().subscribe();
  }

  update(prefs: Prefs): void {
    data.set("prefs", prefs);
    this._prefs$.next(prefs);
  }

  private get$(): Observable<Prefs> {
    return data.get$<Prefs>("prefs").pipe(
      tap((prefs) => {
        if (!prefs) {
          data.set("prefs", defaultPrefs);
        }
        this._prefs$.next(prefs ? prefs : defaultPrefs);
      })
    );
  }
}
