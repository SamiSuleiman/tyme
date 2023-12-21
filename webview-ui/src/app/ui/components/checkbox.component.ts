import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { provideVSCodeDesignSystem, vsCodeCheckbox } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeCheckbox);

@Component({
  template: `
    <vscode-checkbox [disabled]="disabled" [checked]="checked" (change)="onInput($event.target)">
      {{ label }}
    </vscode-checkbox>
  `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  selector: "app-checkbox",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CheckboxComponent implements ControlValueAccessor {
  value = false;

  @Input({ required: true }) label = "";
  @Input() disabled = false;
  @Input() checked = false;

  onChange = (value: string): void => {};
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

  onInput(el: any): void {
    this.writeValue(el.checked);
  }
}
