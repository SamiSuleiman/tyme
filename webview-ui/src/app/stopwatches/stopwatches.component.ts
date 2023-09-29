import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { allComponents, provideVSCodeDesignSystem } from "@vscode/webview-ui-toolkit";
import { EMPTY, Observable } from "rxjs";
import { Stopwatch } from "./stopwatch/stopwatch.model";
import { StopwatchesService } from "./stopwatches.service";

provideVSCodeDesignSystem().register(allComponents);
@Component({
  selector: "app-stopwatches",
  templateUrl: "./stopwatches.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchesComponent implements OnInit {
  private readonly service = inject(StopwatchesService);

  stopwatches$: Observable<Stopwatch[]> = EMPTY;

  ngOnInit() {
    this.stopwatches$ = this.service.stopwatches$;
  }

  onClickGet() {
    this.service.get$().subscribe();
  }
}
