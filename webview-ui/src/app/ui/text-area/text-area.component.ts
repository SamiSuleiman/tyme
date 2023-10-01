import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-text-area",
  templateUrl: "./text-area.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
})
export class TextAreaComponent implements ControlValueAccessor {
  value: string = "";

  @Input() label = "";
  @Input() disabled = false;
  @Input() placeholder = "";
  @Input() icon = "";

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(obj: any) {
    if (this.disabled) return;

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
