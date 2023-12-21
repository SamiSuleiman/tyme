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
import { KeybindsService } from "../../prefs/keybinds.service";

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
  providers: [KeybindsService],
  selector: "app-keybind-selection-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class KeybindSelectionInputComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly keybindsService = inject(KeybindsService);

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

    const keybind = this.keybindsService.getKeybindFromKeyboardEvent(event);
    if (!keybind) return;

    this.keybindControl.setValue(keybind);
    this.endListening();
  }

  endListening() {
    this.keybindSelectorPlaceholder.set("Press here to start listening");
    this.isListening.set(false);
  }
}
