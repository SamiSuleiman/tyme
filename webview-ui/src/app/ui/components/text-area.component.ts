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
import { provideVSCodeDesignSystem, vsCodeTextArea } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeTextArea);

@Component({
  template: `
    <vscode-text-area
      style="width: 100%"
      [value]="value"
      resize="vertical"
      [placeholder]="placeholder"
      (input)="onInput($event.target)"
      cols="22"
      rows="10"
    >
      {{ label }}
    </vscode-text-area>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
  selector: "app-text-area",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TextAreaComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

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
    this.cdr.markForCheck();
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
