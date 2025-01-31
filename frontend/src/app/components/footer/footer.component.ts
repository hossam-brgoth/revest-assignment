// src/app/components/footer/footer.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FooterComponent {
  newsletterForm: FormGroup;
  isSubmitting = false;
  subscriptionSuccess = false;

  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.newsletterForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  async onSubmit() {
    if (this.newsletterForm.valid) {
      this.isSubmitting = true;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.subscriptionSuccess = true;
        this.newsletterForm.reset();
      } catch (error) {
        console.error('Newsletter subscription failed:', error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      Object.keys(this.newsletterForm.controls).forEach(key => {
        const control = this.newsletterForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
