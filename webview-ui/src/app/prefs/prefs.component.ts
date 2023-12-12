import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
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
        <vscode-button appearance="icon" mat-dialog-close>
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
  imports: [MatDialogModule, MatButtonModule],
  providers: [PrefsService],
  selector: "app-prefs",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrefsComponent {
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
