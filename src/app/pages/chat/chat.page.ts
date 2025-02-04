import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Message } from 'src/app/core/models/message';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessagesService } from 'src/app/shared/services/message.service';

@UntilDestroy()
@Component({
  selector: 'app-chat',
  providers: [MessagesService,AuthService],
  standalone: false,
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  private readonly messagesService = inject(MessagesService);
  private readonly authService = inject(AuthService);

  messageInput = new FormControl<string>('');
  messages: Message[] = [];

  constructor() {
    this.messagesService
      .getMessages('0')
      .pipe(untilDestroyed(this))
      .subscribe((m) => (this.messages = m));
  }

  sendMessage(): void {
    if (this.messageInput.value?.trim() === '') return;

    let userActive: string = 'Anonimo';
    if (this.authService.userData) {
      userActive = this.authService.userData.value?.displayName!;
    }

    this.messagesService.addMessage({
      user: userActive,
      date: new Date().toString(),
      text: this.messageInput.value!,
    });

    this.messageInput.setValue('');
  }

  borrarMessages() {
    this.messagesService.deleteMessages();
  }

  private generateMessages() {
    if (this.messages.length === 0) return;

    const lastDate = this.messages[0].date;
    console.log(lastDate);

    this.messagesService
      .getMessages(lastDate)
      .pipe(untilDestroyed(this))
      .subscribe((m) => (this.messages = m));
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.generateMessages();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
}
