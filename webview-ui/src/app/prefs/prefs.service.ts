import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, shareReplay, tap } from "rxjs";
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
    data
      .get$<Prefs>("prefs")
      .pipe(
        filter((prefs) => !prefs),
        tap(() => data.set("prefs", defaultPrefs))
      )
      .subscribe();
  }
}
