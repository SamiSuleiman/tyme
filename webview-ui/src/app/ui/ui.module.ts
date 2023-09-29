import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { TextAreaComponent } from "./text-area/text-area.component";
import { TextFieldComponent } from "./text-field/text-field.component";

@NgModule({
  declarations: [TextFieldComponent, TextAreaComponent],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [TextFieldComponent, TextAreaComponent],
})
export class UiModule {}
