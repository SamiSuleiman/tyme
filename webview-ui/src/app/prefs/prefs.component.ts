import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { take, tap } from "rxjs";
import { CheckboxComponent } from "../ui/components/checkbox.component";
import { KeybindSelectionInputComponent } from "../ui/components/keybind-selection-input.component";
import { Prefs } from "./prefs.model";
import { PrefsService } from "./prefs.service";

@Component({
  template: `
    <div class="container">
      <h2 mat-dialog-title>Manage Preferences</h2>
      <mat-dialog-content class="mat-typography">
        <form [formGroup]="prefsForm" (ngSubmit)="onSubmit()">
          <div>
            <h3>General</h3>
            <app-checkbox
              label="Show stats"
              formControlName="showStats"
              [checked]="getControl(undefined, 'showStats').value"
            >
            </app-checkbox>
            <app-checkbox
              label="Show bulk actions"
              formControlName="showBulkActions"
              [checked]="getControl(undefined, 'showBulkActions').value"
            >
            </app-checkbox>
            <app-checkbox
              label="Show pauses"
              formControlName="showPauses"
              [checked]="getControl(undefined, 'showPauses').value"
            >
            </app-checkbox>
          </div>
          <vscode-divider></vscode-divider>
          <div formGroupName="filter">
            <h3>Filters</h3>
            <app-checkbox
              label="Running"
              formControlName="running"
              [checked]="getControl('filter', 'running').value"
            ></app-checkbox>
            <app-checkbox
              label="Paused"
              formControlName="paused"
              [checked]="getControl('filter', 'paused').value"
            >
            </app-checkbox>
            <app-checkbox
              label="Stopped"
              formControlName="stopped"
              [checked]="getControl('filter', 'stopped').value"
            ></app-checkbox>
            <vscode-divider></vscode-divider>
            <div>
              <h3>Keybinds</h3>
              <div class="selection-inputs__container">
                <app-keybind-selection-input
                  label="Delete all"
                  [keybindControl]="getControl('keybinds', 'deleteAll')"
                ></app-keybind-selection-input>
                <app-keybind-selection-input
                  label="Pause all"
                  [keybindControl]="getControl('keybinds', 'pauseAll')"
                ></app-keybind-selection-input>
                <app-keybind-selection-input
                  label="Resume all"
                  [keybindControl]="getControl('keybinds', 'resumeAll')"
                ></app-keybind-selection-input>
                <app-keybind-selection-input
                  label="Stop all"
                  [keybindControl]="getControl('keybinds', 'stopAll')"
                ></app-keybind-selection-input>
                <app-keybind-selection-input
                  label="Toggle drawer"
                  [keybindControl]="getControl('keybinds', 'toggleDrawer')"
                ></app-keybind-selection-input>
                <app-keybind-selection-input
                  label="Submit"
                  [keybindControl]="getControl('keybinds', 'submit')"
                ></app-keybind-selection-input>
              </div>
            </div>
          </div>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
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

      .selection-inputs__container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
    }
  `,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    CheckboxComponent,
    KeybindSelectionInputComponent,
  ],
  selector: "app-prefs",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrefsComponent implements OnInit {
  private readonly matDialog = inject(MatDialog);
  private readonly perfsService = inject(PrefsService);
  private readonly cdr = inject(ChangeDetectorRef);

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
    }),
    showStats: new FormControl(false),
    showPauses: new FormControl(false),
    showBulkActions: new FormControl(false),
  });

  ngOnInit(): void {
    this.perfsService.prefs$
      .pipe(
        take(1),
        tap((perfs) => {
          this.prefsForm.patchValue(perfs);
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }

  onSubmit(): void {
    this.perfsService.update(this.prefsForm.value as Prefs);
    this.matDialog.closeAll();
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

  getControl(group?: string, key?: string): FormControl {
    return (group ? this.prefsForm.get(group) : this.prefsForm)?.get(key ?? "") as FormControl;
  }
}
