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

  @Input() disabled = false;
  @Input() placeholder = "";
  @Input() icon = "";

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(obj: any): void {
    if (this.disabled) return;

    this.value = obj;
    this.onChange(obj);
    this.onTouched();
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

  onInput(el: any) {
    this.writeValue(el.value);
  }
}
