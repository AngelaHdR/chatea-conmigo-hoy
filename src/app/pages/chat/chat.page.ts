import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonicModule,
} from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessagesService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  readonly authService = inject(AuthService);
  readonly messagesService = inject(MessagesService);

  @ViewChild(IonContent) content?: IonContent;
  disableInfiniteScroll = true;
  messageInput = new FormControl<string>('', Validators.required);
  userData = this.authService.userData();
  locationString = '';
  total: number = 0;
  openEdit: boolean = false;
  dateEdit: number = 0;

  ngOnInit(): void {
    this.messagesService.getLastMessages();
    this.messagesService.countMessages().then((total) => {
      this.total = total;
    });

    setTimeout(() => {
      this.scrollBottom();
    }, 900);

    setTimeout(() => {
      this.disableInfiniteScroll = false;
    }, 2000);

    Geolocation.getCurrentPosition().then((position) => {
      this.locationString =
        'Lat: ' +
        position.coords.latitude.toPrecision(4) +
        ', Lon:' +
        position.coords.longitude.toPrecision(4);
    });
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

  deleteAllMessages() {
    this.messagesService.deleteMessages();
  }

  deleteOneMessage(date: number) {
    this.messagesService.deleteOneMessage(date);
    setTimeout(() => {
      this.scrollBottom();
    }, 100);
  }

  modifyMessage(date: number, text: string) {
    this.messagesService.modifyMessage(date, text);
    setTimeout(() => {
      this.scrollBottom();
    }, 100);
    this.closeEditForm();
  }

  openEditForm(date: number) {
    this.dateEdit = date;
    this.openEdit = true;
  }

  closeEditForm() {
    this.openEdit = false;
    this.dateEdit = 0;
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      this.generateMessages();
      this.disableInfiniteScroll = true;
      event.target.complete();
    }, 500);
  }

  private generateMessages() {
    this.messagesService.getLastMessages();
    if (this.messagesService.orderMessages().length >= this.total - 1) {
      setTimeout(() => {
        this.scrollDownBy100();
        this.disableInfiniteScroll = true;
      }, 100);
    } else {
      setTimeout(() => {
        this.scrollDownBy500();
        this.disableInfiniteScroll = false;
      }, 100);
    }
  }

  scrollBottom() {
    if (this.content) {
      this.content.scrollToBottom(100);
    }
  }

  scrollDownBy100() {
    if (this.content) {
      this.content.scrollToPoint(0, 100, 100);
    }
  }

  async scrollDownBy500() {
    if (this.content) {
      const scrollElement = await this.content.getScrollElement();
      const currentScrollTop = scrollElement.scrollTop;

      this.content.scrollToPoint(0, currentScrollTop + 550, 300);
    }
  }
}
