import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Geolocation, Position } from '@capacitor/geolocation';
import { InfiniteScrollCustomEvent, IonContent, IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessagesService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports:[CommonModule,
      FormsModule,
      IonicModule,
      ReactiveFormsModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  private readonly authService = inject(AuthService);
  readonly messagesService = inject(MessagesService);

  @ViewChild(IonContent) content?: IonContent;
  messageInput = new FormControl<string>('', Validators.required);
  userData = this.authService.userData();
  locationString = '';

  ngOnInit(): void {
    this.messagesService.getLastMessages();
    setTimeout(() => {
      this.scrollBottom();
    }, 700);

    Geolocation.getCurrentPosition().then((position) => {
      this.locationString =
        'Lat: ' +
        position.coords.latitude.toPrecision(4) +
        ', Lon:' +
        position.coords.longitude.toPrecision(4);
    });
  }

  scrollBottom() {
    if (this.content) {
      this.content.scrollToBottom(100);
    }
  }

  scrollToMiddle() {
    if (this.content) {
      this.content.scrollToPoint(0, 100, 100);
    }
  }

  sendMessage(): void {
    if (!this.userData) return;

    this.messagesService.addMessage({
      user: this.userData?.displayName!,
      date: new Date().getTime(),
      text: this.messageInput.value!,
      location: this.locationString,
    });

    this.messageInput.reset();
    setTimeout(() => {
      this.scrollBottom();
    }, 100);
  }

  borrarMessages() {
    this.messagesService.deleteMessages();
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      this.generateMessages();
      event.target.complete();
    }, 700);
  }

  private generateMessages() {
    this.messagesService.getLastMessages();
    setTimeout(() => {
      this.scrollToMiddle();
    }, 100);
  }
}
