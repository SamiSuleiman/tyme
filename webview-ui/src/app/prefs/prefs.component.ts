import { ChangeDetectionStrategy, Component } from "@angular/core";
import { PrefsService } from "./prefs.service";

@Component({
  template: `<div class="container">asdasdasd</div>`,
  styles: `
    .container{
      background-color: var(--background);
      width: 100%;
      height: 100%;
    }
  `,
  imports: [],
  providers: [PrefsService],
  selector: "app-prefs",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
