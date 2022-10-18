import { Component } from '@angular/core';
import { NameComponent } from './name.component';

@Component({
  standalone: true,
  imports: [NameComponent],
  template: `
    <h1>About</h1>
    <p>Here is something information about this features of this demo.</p>
    <h4>Standalone Components</h4>
    <p>First, the primary objective of this demo is to showcase Angular's standalone component feature that is currently a developer preview released in Angular version 14.</p>
  `,
  styles: [
    `
      :host {
        margin: 16x;
      }
    `,
  ],
})
export class AboutComponent {}
