import { Injectable } from "@angular/core";
import { DateTime } from "luxon";
import { BehaviorSubject, shareReplay, switchMap, take, tap } from "rxjs";
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
    this.get().subscribe();
  }

  get() {
    return this._data.get<Stopwatch[]>("stopwatches").pipe(
      tap((vals) => {
        this._stopwatches$.next(vals ?? []);
      })
    );
  }

  add(stopwatch: AddStopwatch) {
    const newStopwatch: Stopwatch = {
      id: genId(),
      name: stopwatch.name,
      desc: stopwatch.desc,
      createdAt: DateTime.now(),
      start: DateTime.now(),
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

  update(stopwatch: Stopwatch) {
    return this.stopwatches$.pipe(
      take(1),
      tap((s) => {
        const old = s.find((old) => old.id === stopwatch.id);
        if (!old) return;
        const updatedArr = [...s.filter((old) => old.id === stopwatch.id), stopwatch];
        this._data.set("stopwatches", updatedArr);
      }),
      switchMap(() => this.get())
    );
  }
}
