import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html'
})
export class HeroComponent implements OnInit {
  slides = [
    {
      image: 'https://placehold.co/1200x400',
      alt: 'First slide',
      title: 'Welcome to Revest Solutions',
      description: 'Discover our amazing products',
      active: true
    },
    {
      image: 'https://placehold.co/1200x400',
      alt: 'Second slide',
      title: 'Special Offers',
      description: 'Get amazing deals today',
      active: false
    },
    {
      image: 'https://placehold.co/1200x400',
      alt: 'Third slide',
      title: 'New Arrivals',
      description: 'Check out our latest products',
      active: false
    }
  ];

  currentSlide = 0;

  ngOnInit() {
    setInterval(() => {
      this.slides[this.currentSlide].active = false;
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      this.slides[this.currentSlide].active = true;
    }, 5000);
  }
}
