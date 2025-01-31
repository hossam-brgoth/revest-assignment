import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { CrossSellComponent } from '../cross-sell/cross-sell.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, CrossSellComponent],
  template: `
    <app-hero></app-hero>
    <app-cross-sell></app-cross-sell>
  `
})
export class HomeComponent {}
