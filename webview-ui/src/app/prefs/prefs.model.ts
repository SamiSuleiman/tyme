import { StopwatchFilter, defaultFilter } from "../stopwatches/stopwatch.model";

export interface Prefs {
  filter: StopwatchFilter;
  keybinds: Keybinds;
  showStats: boolean;
  showPauses: boolean;
  showBulkActions: boolean;
}

export interface Keybinds {
  deleteAll: string;
  pauseAll: string;
  resumeAll: string;
  stopAll: string;
  toggleDrawer: string;
  submit: string;
}

const defaultKeybinds: Keybinds = {
  deleteAll: "meta.backspace",
  pauseAll: "meta.p",
  resumeAll: "meta.r",
  stopAll: "meta.s",
  toggleDrawer: "meta.d",
  submit: "meta.enter",
};

export const defaultPrefs: Prefs = {
  filter: defaultFilter,
  keybinds: defaultKeybinds,
  showPauses: true,
  showStats: true,
  showBulkActions: true,
};

export interface KeybindPressEvent {
  event: KeyboardEvent;
  keybind: string;
}
