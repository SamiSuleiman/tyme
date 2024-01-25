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
import { provideVSCodeDesignSystem, vsCodeTextArea } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeTextArea);

@Component({
  template: `
    <vscode-text-area
      style="width: 100%"
      [value]="value"
      resize="vertical"
      [placeholder]="$placeholder()"
      (input)="onInput($event.target)"
      cols="22"
      rows="10"
    >
      {{ $label() }}
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

  $label = input("", { alias: "label" });
  $disabled = input(false, { alias: "disabled" });
  $placeholder = input("", { alias: "placeholder" });
  $icon = input("", { alias: "icon" });

  onChange = (value: string): void => {};
  onTouched = (): void => {};

  writeValue(obj: any): void {
    if (this.$disabled()) return;

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
