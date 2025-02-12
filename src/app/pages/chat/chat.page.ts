import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Geolocation, Position } from '@capacitor/geolocation';
import { InfiniteScrollCustomEvent, IonContent } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessagesService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  private readonly authService = inject(AuthService);
  readonly messagesService = inject(MessagesService);

  @ViewChild(IonContent) content?: IonContent;
  messageInput = new FormControl<string>('', Validators.required);
  userData = this.authService.userData();
  location?: Promise<Position>;
  locationString = '';

  ngOnInit(): void {
    this.messagesService.getLastMessages();

    this.scrollBottom();
    this.location = Geolocation.getCurrentPosition();
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

  async sendMessage(): Promise<void> {
    if (!this.userData) return;

    this.messagesService.addMessage({
      user: this.userData?.displayName!,
      date: new Date().getTime(),
      text: this.messageInput.value!,
      location: this.locationString,
    });

    this.messageInput.reset();
    this.scrollBottom();
  }

  borrarMessages() {
    this.messagesService.deleteMessages();
    setTimeout(() => {
      this.scrollBottom();
    }, 200);
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.generateMessages();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  private generateMessages() {
    this.messagesService.getLastMessages();
  }
}
