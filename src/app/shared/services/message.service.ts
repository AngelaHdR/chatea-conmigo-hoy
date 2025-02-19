import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import {
  get,
  getDatabase,
  limitToLast,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
} from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { Message } from 'src/app/core/models/message';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  auth = getAuth();
  db = getDatabase();

  size = 10;
  messages: WritableSignal<Message[]> = signal([]);
  orderMessages: Signal<Message[]> = computed(() => {
    this.messages().sort((a: Message, b: Message) => a.date - b.date);
    return this.messages().filter(
      (msg, index, self) =>
        index === self.findIndex((m) => m.date === msg.date),
    );
  });
  
  addMessage(messageInput: Message): void {
    const _ref = push(ref(this.db, '/messages'));
    set(_ref, messageInput);
    this.messages.update((_messages) => [..._messages, messageInput]);
  }

  deleteMessages() {
    remove(ref(this.db, '/messages'));
    this.messages.set([]);
  }

  deleteOneMessage(date: number) {
    const messagesRef = ref(this.db, '/messages');
    get(messagesRef).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        if (message.date === date) {
          remove(childSnapshot.ref);
          this.messages.update((_messages) => [
            ..._messages.filter((m) => m.date !== date),
          ]);
        }
      });
    });
  }

  modifyMessage(date: number, text: string) {
    const messagesRef = ref(this.db, '/messages');
    get(messagesRef).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        if (message.date === date) {
          set(childSnapshot.ref, { ...message, text });
          this.messages.update((_messages) => [
            ..._messages.map((m) => (m.date === date ? { ...m, text } : m)),
          ]);
        }
      });
    });
  }

  async countMessages() {
    const messagesRef = ref(this.db, '/messages');

    const snapshot = await get(messagesRef);
    if (snapshot.exists()) {
      return snapshot.size;
    } else {
      return 0;
    }
  }

  getLastMessages() {
    const messagesRef = query(
      ref(this.db, '/messages'),
      orderByChild('date'),
      limitToLast(this.size),
    );

    get(messagesRef).then((snapshot) => {
      const emptyMessages: any = [];
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        emptyMessages.push(message);
      });
      this.messages.update((_messages) => [..._messages, ...emptyMessages]);
    });

    this.size += 10;
  }
}
