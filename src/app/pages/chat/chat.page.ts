import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonContent } from '@ionic/angular';
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

  @ViewChild(IonContent) content?: IonContent;
  messageInput = new FormControl<string>('', Validators.required);
  date: string = '0';

  userData = this.authService.userData();

  constructor(){
    this.messagesService.getLastMessages(this.date);
    this.messagesService.getInitialMessage();
    setTimeout(() => {
      this.scrollBottom();
    }, 1000);
  }

  scrollBottom(){
    if(this.content){
      this.content.scrollToBottom(100);
    }
  }

  sendMessage(): void {
    if (!this.userData) return;

    this.messagesService.addMessage({
      user: this.userData.displayName!,
      date: new Date().toString(),
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

  private generateMessages() {
    if (this.messagesService.messages().length === 0) return;
    this.messagesService.getLastMessages(this.date);
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.date = this.messagesService.messages()[0].date;
    this.generateMessages();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
