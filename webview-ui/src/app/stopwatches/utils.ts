import { DateTime, Duration } from "luxon";
import { Stopwatch } from "./stopwatch/stopwatch.model";

//todo: is this still usable? probably not?
export function getElapsed(stopwatch: Stopwatch): Duration {
  if (stopwatch.isStopped && stopwatch.stop) {
    let elapsed = stopwatch.stop.diff(stopwatch.start, ["hours", "minutes"]);
    if (stopwatch.elapsed) elapsed = elapsed.plus(stopwatch.elapsed);
    return elapsed.shiftTo("hours", "minutes");
  } else if (stopwatch.isPaused && stopwatch.elapsed)
    return stopwatch.elapsed.shiftTo("hours", "minutes");

  let elapsed = DateTime.now().diff(stopwatch.start, ["hours", "minutes"]);
  if (stopwatch.elapsed) elapsed = elapsed.plus(stopwatch.elapsed);

  return elapsed.shiftTo("hours", "minutes");
}

export function genId() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 18; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
