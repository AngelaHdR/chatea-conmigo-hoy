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
export class ChatPage {
  private readonly authService = inject(AuthService);
  readonly messagesService = inject(MessagesService);

  @ViewChild(IonContent) content?: IonContent;
  messageInput = new FormControl<string>('', Validators.required);
  date: string = this.generarFecha();

  userData = this.authService.userData();

  constructor() {
    console.log('Cargando');
    //this.messagesService.getLastMessages(this.date);
    this.messagesService.loadFirstMessages();
    this.messagesService.getInitialMessage();
    setTimeout(() => {
      this.scrollBottom();
    }, 1000);
  }

  scrollBottom() {
    if (this.content) {
      this.content.scrollToBottom(100);
    }
  }

  sendMessage(): void {
    if (!this.userData) return;

    this.messagesService.addMessage({
      user: this.userData.displayName!,
      date: this.generarFecha(),
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
    console.log(this.messagesService.messages().length);
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.date = this.messagesService.messages()[0].date;
    this.generateMessages();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  private generarFecha():string {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes comienza desde 0
    const año = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');

    const formato = `${año}/${mes}/${dia} ${hora}:${minutos}:${segundos}`;

    return formato;
  }
}
