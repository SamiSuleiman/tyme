import { StopwatchFilter, defaultFilter } from "../stopwatches/stopwatch.model";

export interface Prefs {
  filter: StopwatchFilter;
  keybinds: Keybinds;
}

export interface Keybinds {
  deleteAll: string;
  pauseAll: string;
  resumeAll: string;
  stopAll: string;
  toggleDrawer: string;
  confirmDelete: boolean;
  submit: string;
}

const defaultKeybinds: Keybinds = {
  deleteAll: "alt.backspace",
  pauseAll: "alt.p",
  resumeAll: "alt.r",
  stopAll: "alt.enter.s",
  toggleDrawer: "alt.d",
  confirmDelete: true,
  submit: "alt.enter",
};

export const defaultPrefs: Prefs = {
  filter: defaultFilter,
  keybinds: defaultKeybinds,
};
