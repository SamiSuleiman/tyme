import { Pipe, PipeTransform } from "@angular/core";
import { DateTime } from "luxon";

@Pipe({
  name: "formattedDate",
  standalone: true,
})
export class FormattedDatePipe implements PipeTransform {
  transform(date: string): string {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT);
  }
}
