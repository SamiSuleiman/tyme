import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { TextFieldComponent } from "./text-field/text-field.component";

@NgModule({
  declarations: [TextFieldComponent],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [TextFieldComponent],
})
export class UiModule {}
