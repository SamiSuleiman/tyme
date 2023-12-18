import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { provideVSCodeDesignSystem, vsCodeTextField } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeTextField);

@Component({
  template: `
    <div>
      <p>{{ label }}</p>
      <vscode-text-field
        (focusout)="endListening()"
        (click)="startListening()"
        type="string"
        [placeholder]="keybindSelectorPlaceholder()"
        appearance="icon"
        readonly
      >
        <span slot="start" class="{{ 'codicon codicon-record-keys' }}"></span>
        Current Keybind: {{ keybindSelectorCurrVal() }}
      </vscode-text-field>
    </div>
  `,
  styles: `
    p {
      margin: 0;
      font-size: 0.75rem;
    }

    vscode-text-field { 
      display: flex;
      gap: 6px;
      caret-color: transparent;
      align-items: center;

    &::part(control) {
      cursor: pointer; 
    }
 }

  `,
  selector: "app-keybind-selection-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class KeybindSelectionInputComponent implements OnInit {
  @Input({ required: true }) label: string;
  @Input({ required: true }) keybindControl: FormControl;

  isListening = signal(false);
  keybindSelectorPlaceholder = signal("Press here to start listening");
  keybindSelectorCurrVal = signal("");

  ngOnInit(): void {
    this.keybindSelectorCurrVal.set(this.keybindControl.value);
  }

  startListening() {
    this.keybindSelectorPlaceholder.set("listening...");
    this.isListening.set(true);
  }

  @HostListener("window:keydown", ["$event"])
  onSelecting(event: KeyboardEvent) {
    if (!this.isListening()) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopImmediatePropagation();

    const key =
      event.key === "Alt"
        ? null
        : event.key === "Control"
        ? null
        : event.key === "Meta"
        ? null
        : event.key;

    const modifier = event.ctrlKey
      ? "control"
      : event.altKey
      ? "alt"
      : event.metaKey
      ? "meta"
      : null;

    if (!modifier || !key) return;

    this.keybindSelectorCurrVal.set(`${modifier}+${key}`);
    this.keybindControl.setValue(`${modifier}+${key}`);
    this.endListening();
  }

  endListening() {
    this.keybindSelectorPlaceholder.set("Press here to start listening");
    this.isListening.set(false);
  }
}
