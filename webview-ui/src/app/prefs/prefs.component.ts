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
import { MatDialogModule } from "@angular/material/dialog";
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
              label="Show pauses"
              formControlName="showPauses"
              [checked]="getControl(undefined, 'showPauses').value"
            >
            </app-checkbox>
            <app-checkbox
              label="Confirm delete"
              formControlName="confirmDelete"
              [checked]="getControl(undefined, 'confirmDelete').value"
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
            <h3>Keybinds</h3>
            <app-keybind-selection-input
              label="Delete all"
              [keybindControl]="getControl('keybinds', 'deleteAll')"
            ></app-keybind-selection-input>
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
    }
  `,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    CheckboxComponent,
    KeybindSelectionInputComponent,
  ],
  providers: [PrefsService],
  selector: "app-prefs",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrefsComponent implements OnInit {
  private readonly perfsService = inject(PrefsService);
  private readonly cdr = inject(ChangeDetectorRef);

  prefsForm = new FormGroup({
    filter: new FormGroup({
      running: new FormControl(false),
      paused: new FormControl(false),
      stopped: new FormControl(false),
    }),
    // todo: make a "keybind selection" component to handle this
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
    console.log(this.prefsForm.value);
    this.perfsService.update(this.prefsForm.value as Prefs);
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
