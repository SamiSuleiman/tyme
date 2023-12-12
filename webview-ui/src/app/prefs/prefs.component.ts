import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  template: ` <p>prefs works!</p> `,
  styles: ``,
  imports: [CommonModule],
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
