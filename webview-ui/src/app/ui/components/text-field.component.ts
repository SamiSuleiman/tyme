import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  forwardRef,
  inject,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { provideVSCodeDesignSystem, vsCodeTextField } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeTextField);

@Component({
  template: `
    <vscode-text-field
      style="width: 100%"
      [type]="type"
      [value]="value"
      [placeholder]="placeholder"
      (input)="onInput($event.target)"
      [disabled]="disabled"
      appearance="icon"
    >
      <span slot="start" class="{{ 'codicon codicon-' + icon }}"></span>
      {{ label }}
    </vscode-text-field>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
  selector: "app-text-field",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TextFieldComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  value: string = "";

  @Input() disabled = false;
  @Input() placeholder = "";
  @Input() icon = "";
  @Input() type: "number" | "string" = "string";
  @Input() label = "";

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj;
    this.onChange(obj);
    this.onTouched();
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(el: any): void {
    this.writeValue(el.value);
  }
}
