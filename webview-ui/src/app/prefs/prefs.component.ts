import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { tap } from "rxjs";
import { PrefsService } from "./prefs.service";

@Component({
  template: `
    <div class="container">
      <h2 mat-dialog-title>Manage Preferences</h2>
      <mat-dialog-content class="mat-typography"> </mat-dialog-content>
      <mat-dialog-actions align="start">
        <vscode-button appearance="icon" mat-dialog-close>
          <span class="icon"><i [class]="'codicon codicon-close'"></i></span>
        </vscode-button>
        <vscode-button appearance="icon" (click)="onSubmit()">
          <span class="icon"><i [class]="'codicon codicon-check'"></i></span>
        </vscode-button>
      </mat-dialog-actions>
    </div>
  `,
  styles: `
    .container { 
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      &, & > * {
        background-color: var(--background);
      }
    }
  `,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  providers: [PrefsService],
  selector: "app-prefs",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrefsComponent implements OnInit {
  private readonly perfsService = inject(PrefsService);

  prefsForm = new FormGroup({
    filter: new FormGroup({
      running: new FormControl(false),
      paused: new FormControl(false),
      stopped: new FormControl(false),
    }),
    keybinds: new FormGroup({
      deleteAll: new FormControl(""),
      pauseAll: new FormControl(""),
      resumeAll: new FormControl(""),
      stopAll: new FormControl(""),
      toggleDrawer: new FormControl(""),
      submit: new FormControl(""),
      confirmDelete: new FormControl(false),
    }),
    showStats: new FormControl(false),
    showPauses: new FormControl(false),
    confirmDelete: new FormControl(false),
  });

  ngOnInit(): void {
    this.perfsService.prefs$
      .pipe(tap((perfs) => this.prefsForm.patchValue(perfs)))
      .subscribe(console.log);
  }

  onSubmit(): void {
    console.log(this.prefsForm.value);
  }
  // @Input()
  // public on: string;
  // private dispose: Function;
  // constructor(
  //   private renderer: Renderer,
  //   private elementRef: ElementRef
  // ) {}
  // ngOnInit() {
  //   this.dispose = this.renderer.listen(this.elementRef.nativeElement, this.on, (e) =>
  //     console.log(e)
  //   );
  // }
  // ngOnDestroy() {
  //   this.dispose();
  // }
}
