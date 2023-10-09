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
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        height: 100%;
        margin: 1rem;
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
