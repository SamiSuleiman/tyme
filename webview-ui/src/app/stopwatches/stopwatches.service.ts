import { Injectable } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { BehaviorSubject, shareReplay, take, tap } from "rxjs";
import { Data } from "../utilities/data";
import { AddStopwatch, Stopwatch } from "./stopwatch/stopwatch.model";
import { genId } from "./utils";

@Injectable()
export class StopwatchesService {
  private readonly _data: Data;

  private readonly _stopwatches$ = new BehaviorSubject<Stopwatch[]>([]);
  stopwatches$ = this._stopwatches$.pipe(shareReplay({ bufferSize: 1, refCount: true }));

  constructor() {
    this._data = new Data();
    this.get$().subscribe();
  }

  get$() {
    return this._data.get$<Stopwatch[]>("stopwatches").pipe(
      tap((vals) => {
        this._stopwatches$.next(vals ?? []);
      })
    );
  }

  add$(stopwatch: AddStopwatch) {
    const newStopwatch: Stopwatch = {
      id: genId(),
      name: stopwatch.name,
      desc: stopwatch.desc,
      createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
      start: DateTime.now().toString(),
      elapsed: Duration.fromObject({ minutes: stopwatch.elapsedInMin }).toString() ?? "",
      isPaused: false,
      isStopped: false,
      pauses: 0,
    };

    return this.stopwatches$.pipe(
      take(1),
      tap((s) => {
        const stopwatches = [...s, newStopwatch];
        this._stopwatches$.next(stopwatches);
        this._data.set<Stopwatch[]>("stopwatches", stopwatches);
      })
    );
  }

  update$(stopwatch: Stopwatch) {
    return this.stopwatches$.pipe(
      take(1),
      tap((s) => {
        const old = s.find((old) => old.id === stopwatch.id);
        if (!old) return;
        const updated = [...s.filter((old) => old.id !== stopwatch.id), stopwatch];
        this._stopwatches$.next(updated);
        this._data.set("stopwatches", updated);
      })
    );
  }

  remove$(id: string) {
    return this.stopwatches$.pipe(
      take(1),
      tap((s) => {
        const filtered = s.filter((sw) => sw.id !== id);
        this._stopwatches$.next(filtered);
        this._data.set("stopwatches", filtered);
      })
    );
  }
}
