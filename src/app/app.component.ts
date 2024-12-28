
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css" />
  <a class="github-fork-ribbon" href="https://github.com/payne/sqlite-demo" data-ribbon="Fork me on GitHub" title="Fork me on GitHub">Fork me on GitHub</a>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent {}

