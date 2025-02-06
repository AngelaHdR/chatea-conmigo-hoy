import { Injectable, OnInit, signal, WritableSignal } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import {
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
  firstMessage?: Message;

  addMessage(messageInput: Message): void {
    const _ref = push(ref(this.db, '/messages'));
    set(_ref, messageInput);

    this.messages.update((_messages) => [..._messages, messageInput]);
  }

  deleteMessages() {
    remove(ref(this.db, '/messages'));
    this.messages.set([]);
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
        console.log(message);
        this.firstMessage = message;
      });
    });

    console.log(this.firstMessage);
  }

  getLastMessages(start: string) {
    const messagesRef = query(
      ref(this.db, '/messages'),
      orderByChild('date'),
      limitToLast(10),
      endBefore(start),
    );

    get(messagesRef).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        if (message.date !== this.firstMessage?.date) {
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
}
