import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      main {
        height: 100%;
      }
    `,
  ],
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule],
})
export class AppComponent {
  title = "tyme";
}
