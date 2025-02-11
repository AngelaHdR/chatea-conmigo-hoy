import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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


  ngOnInit(): void {
    this.messagesService.getLastMessages();

    this.scrollBottom();
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
      user: this.userData.displayName!,
      date: new Date().getTime(),
      text: this.messageInput.value!,
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
    console.log('onIonInfinite');
    this.generateMessages();
    setTimeout(() => {
      event.target.complete();
    }, 200);
  }

  private generateMessages() {
    this.messagesService.getLastMessages();
  }
}
