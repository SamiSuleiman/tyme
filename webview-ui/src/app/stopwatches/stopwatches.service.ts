import { Injectable } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { BehaviorSubject, Observable, shareReplay, take, tap } from "rxjs";
import { data } from "../utilities/data";
import { AddStopwatch, Stopwatch } from "./stopwatch.model";
import { genId } from "./utils";

@Injectable({ providedIn: "root" })
export class StopwatchesService {
  private readonly _stopwatches$ = new BehaviorSubject<Stopwatch[]>([]);
  readonly stopwatches$ = this._stopwatches$.pipe(shareReplay({ bufferSize: 1, refCount: true }));
  readonly bufferStopwatch$ = new BehaviorSubject<Stopwatch | undefined>(undefined);

  get$(): Observable<Stopwatch[]> {
    return data.get$<Stopwatch[]>("stopwatches").pipe(
      tap((vals) => {
        this._stopwatches$.next(vals ?? []);
      })
    );
  }

  add$(stopwatch: AddStopwatch): Observable<Stopwatch[]> {
    const newStopwatch: Stopwatch = {
      id: genId(),
      name: stopwatch.name,
      desc: stopwatch.desc,
      createdAt: DateTime.now().toString(),
      start: DateTime.now().toString(),
      elapsed: Duration.fromDurationLike(stopwatch.elapsed ?? 0).toString() ?? "",
      isPaused: false,
      isStopped: false,
      pauses: 0,
    };

    return this.stopwatches$.pipe(
      take(1),
      tap((s) => {
        const stopwatches = [newStopwatch, ...s];
        this._stopwatches$.next(stopwatches);
        data.set<Stopwatch[]>("stopwatches", stopwatches);
      })
    );
  }

  update$(stopwatches: Stopwatch[]): Observable<Stopwatch[]> {
    return this.stopwatches$.pipe(
      take(1),
      tap((s) => {
        const olds = s.filter((old) => stopwatches.find((toUpdate) => toUpdate.id === old.id));
        if (!olds.length) return;
        const updated = [
          ...stopwatches,
          ...s.filter((old) => !stopwatches.find((updated) => updated.id === old.id)),
        ];
        this._stopwatches$.next(updated);
        data.set("stopwatches", updated);
      })
    );
  }

  remove$(id?: string): Observable<Stopwatch[]> {
    return this.stopwatches$.pipe(
      take(1),
      tap((s) => {
        const filtered = id ? s.filter((sw) => sw.id !== id) : [];
        this._stopwatches$.next(filtered);
        data.set("stopwatches", filtered);
      })
    );
  }
}
