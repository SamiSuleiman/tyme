import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  Input,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl } from "@angular/forms";
import { provideVSCodeDesignSystem, vsCodeTextField } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeTextField);

@Component({
  template: `
    <div>
      <p>
        {{ label }}: <code>{{ keybindControl.value }}</code>
      </p>
      <vscode-text-field
        (focusout)="endListening()"
        (click)="startListening()"
        type="string"
        [placeholder]="keybindSelectorPlaceholder()"
        appearance="icon"
        readonly
      >
        <span slot="start" class="{{ 'codicon codicon-record-keys' }}"></span>
      </vscode-text-field>
    </div>
  `,
  styles: `
    p {
      margin: 0px;
      font-size: 0.75rem;
    }

    vscode-text-field { 
      &::part(control) {
        width: 11rem;
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
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) label: string;
  @Input({ required: true }) keybindControl: FormControl<string>;

  isListening = signal(false);
  keybindSelectorPlaceholder = signal("Press here to start listening");

  ngOnInit(): void {
    this.keybindControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.detectChanges());
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

    if (!(event.ctrlKey || event.metaKey) || !key) return;

    this.keybindControl.setValue(
      `${event.ctrlKey ? "control." : ""}${event.metaKey ? "meta." : ""}${key}`
    );
    this.endListening();
  }

  endListening() {
    this.keybindSelectorPlaceholder.set("Press here to start listening");
    this.isListening.set(false);
  }
}
