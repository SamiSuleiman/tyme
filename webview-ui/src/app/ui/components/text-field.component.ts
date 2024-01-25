import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { provideVSCodeDesignSystem, vsCodeTextField } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeTextField);

@Component({
  template: `
    <vscode-text-field
      style="width: 100%"
      [type]="$type()"
      [value]="value"
      [placeholder]="$placeholder()"
      (input)="onInput($event.target)"
      [disabled]="$disabled()"
      appearance="icon"
    >
      <span slot="start" class="{{ 'codicon codicon-' + $icon() }}"></span>
      {{ $label() }}
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

  $disabled = input(false, { alias: "disabled" });
  $placeholder = input("", { alias: "placeholder" });
  $icon = input("", { alias: "icon" });
  $type = input<"number" | "string">("string", { alias: "type" });
  $label = input("", { alias: "label" });

  value: string = "";

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

  onInput(el: any): void {
    this.writeValue(el.value);
  }
}
