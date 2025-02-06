import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonToolbar, IonTitle } from '@ionic/angular/standalone';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class FooterComponent {}
