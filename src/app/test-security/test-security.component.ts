import { Component } from '@angular/core';

@Component({
  selector: 'app-test-security',
  templateUrl: './test-security.component.html',
  styleUrl: './test-security.component.scss'
})
export class TestSecurityComponent {

  systemFeedback: string = 'System Ready';
  currentCode: string = '';

  appendNumber(number: string) {
    if (this.currentCode.length < 6) {
      this.currentCode += number;
      this.updateFeedback(`Code entry: ${this.currentCode.replace(/./g, '*')}`);
    }
  }

  clearCode() {
    this.currentCode = '';
    this.updateFeedback('Code cleared');
  }

  submitCode() {
    if (this.currentCode.length === 0) {
      this.updateFeedback('Please enter a code');
      return;
    }
    this.updateFeedback(`Code submitted: ${this.currentCode.replace(/./g, '*')}`);
    this.currentCode = '';
  }

  activateFeature(feature: string) {
    switch(feature) {
      case 'arm':
        this.updateFeedback('System arming...');
        break;
      case 'disarm':
        this.updateFeedback('System disarming...');
        break;
      case 'status':
        this.updateFeedback('System status: Operational');
        break;
      case 'zones':
        this.updateFeedback('Checking zones... All secure');
        break;
      case 'alert':
        this.updateFeedback('Silent alert activated');
        break;
      case 'settings':
        this.updateFeedback('Settings menu accessed');
        break;
    }
  }

  private updateFeedback(message: string) {
    this.systemFeedback = message;
  }

}
