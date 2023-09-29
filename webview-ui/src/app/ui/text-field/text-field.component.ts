import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { provideVSCodeDesignSystem, vsCodeTextField } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeTextField);

@Component({
  selector: "app-text-field",
  templateUrl: "./text-field.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
})
export class TextFieldComponent implements ControlValueAccessor {
  value: string = "";

  @Input() disabled = false;
  @Input() placeholder = "";
  @Input() icon = "";
  @Input() numbersOnly = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(obj: any) {
    if (this.disabled || (this.numbersOnly && isNaN(obj))) return;

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
