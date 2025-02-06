import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { Message } from 'src/app/core/models/message';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessagesService } from 'src/app/shared/services/message.service';
import { toObservable } from '@angular/core/rxjs-interop';

@UntilDestroy()
@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  private readonly authService = inject(AuthService);
  readonly messagesService = inject(MessagesService);

  messageInput = new FormControl<string>('', Validators.required);
  date: string = '0';

  userData = this.authService.userData();

  constructor() {
    /* this.getMessages = this.messagesService
      .getMessages(this.date);
    this.getMessages.pipe(untilDestroyed(this)).subscribe((m) => {
      this.messages = m;
      this.date = this.messages[this.messages.length - 1].date;
    }); */
    /* this.messagesService.getMessages(this.date).pipe(untilDestroyed(this)).subscribe((m) => {
      this.messages = m;
      this.date = this.messages[this.messages.length - 1].date;
    }); */

    this.messagesService.getMessages();
  }

  sendMessage(): void {
    if (!this.userData) return;

    this.messagesService.addMessage({
      user: this.userData.displayName!,
      date: new Date().toString(),
      text: this.messageInput.value!,
    });

    this.messageInput.reset();
  }

  borrarMessages() {
    this.messagesService.deleteMessages();
  }

  private generateMessages() {
    if (this.messagesService.messages().length === 0) return;

    /*  this.getMessages
    .pipe(untilDestroyed(this))
    .subscribe((m) => {
      this.messages = m;
      this.date = this.messages[this.messages.length - 1].date;
    }); */

    /* this.messagesService.getMessages(this.date).pipe(untilDestroyed(this)).subscribe((m) => {
      this.messages = m;
      this.date = this.messages[this.messages.length - 1].date;
    }); */
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.messagesService.getMessages();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
}
