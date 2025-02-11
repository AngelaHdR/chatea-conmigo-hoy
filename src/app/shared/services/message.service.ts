import { Injectable, OnInit, signal, WritableSignal } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import {
  endAt,
  endBefore,
  get,
  getDatabase,
  limitToFirst,
  limitToLast,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  startAfter,
  startAt,
} from '@angular/fire/database';
import { Message } from 'src/app/core/models/message';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  auth = getAuth();
  db = getDatabase();

  messages: WritableSignal<any> = signal([]);
  messages2:any[] = [];
  firstMessage?: Message;

  addMessage(messageInput: Message): void {
    const _ref = push(ref(this.db, '/messages'));
    set(_ref, messageInput);

    //señales
    this.messages.update((_messages) => [..._messages, messageInput]);
    //listado
    this.messages2.push(messageInput);
  }

  deleteMessages() {
    remove(ref(this.db, '/messages'));
    //señales
    this.messages.set([]);
    //listado
    this.messages2 = [];
  }

  getInitialMessage() {
    const messagesRef = query(
      ref(this.db, '/messages'),
      orderByChild('date'),
      limitToFirst(1),
    );

    get(messagesRef).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        this.firstMessage = message;
      });
    });
  }

  loadFirstMessages() {
    const messagesRef = query(
      ref(this.db, '/messages'),
      orderByChild('date'),
      limitToLast(10),
    );

    get(messagesRef).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        if (message.date !== this.firstMessage?.date) {
          //listado
          this.messages2.push(message);
          //señales
          this.messages.update((_messages) => [
            ..._messages,
            {
              key: childSnapshot.key,
              ...message,
            },
          ]);
        }
      });
    });
  }

  getLastMessages(start: number) {
    const messagesRef = query(
      ref(this.db, '/messages'),
      orderByChild('date'),
      limitToLast(start),
    );
    
    get(messagesRef).then((snapshot) => {
      let position = 0;
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        if (message.date == this.firstMessage?.date) return;

        //listado
        if(this.messages2.find((m) => m.date === message.date)) return;
        this.messages2.splice(position, 0, message);
        position +=1;

        //señales
        this.messages.update((_messages) => [
          ..._messages,
          {
            key: childSnapshot.key,
            ...message,
          },
        ]);
      });
    });
  }
}
