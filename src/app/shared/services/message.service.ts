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

  getLastMessages(start: string) {
    const messagesRef = query(
      ref(this.db, '/messages'),
      orderByChild('date'),
      startAt(start),
      limitToFirst(10),
    );

    get(messagesRef).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        if (message.date == this.firstMessage?.date) return;

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
