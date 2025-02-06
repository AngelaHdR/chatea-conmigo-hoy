import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { MessagesService } from '../../services/message.service';

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class ScrollComponent {
  readonly messagesService = inject(MessagesService);

  @Input() date!:string;

  constructor() {
    this.messagesService.getInitialMessages();
  }

  private generateMessages() {
    if (this.messagesService.messages().length === 0) return;
    this.messagesService.getNewMessages(this.date);
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
    this.date = this.messagesService.messages()[this.messagesService.messages().length - 1].date;
    this.generateMessages();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

}
