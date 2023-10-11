import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, forwardRef } from "@angular/core";
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TextFieldComponent implements ControlValueAccessor {
  value: string = "";

  @Input() disabled = false;
  @Input() placeholder = "";
  @Input() icon = "";
  @Input() type: "number" | "string" = "string";
  @Input() label = "";

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(obj: any) {
    this.value = obj;
    this.onChange(obj);
    this.onTouched();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  onInput(el: any) {
    this.writeValue(el.value);
  }
}
