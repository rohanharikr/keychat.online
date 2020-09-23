import { writable } from 'svelte/store';

export const featuresData = writable(
    [{
            title: 'Open Source',
            content: 'This project is open sourced under the MIT license, meaning you can do anything with it'
        },
        {
            title: 'No login or signup',
            content: 'Easy as sharing a secret code with someone or creating a new session on your own'
        },
        {
            title: 'No data storage',
            content: 'As you can see from the source code, this project is not connected with any database'
        }
    ]
);

export const working = writable([
    'On starting a new chat, the client sends a secret key to the socket.io server',
    'The server starts a private session based on the key send',
    'The original client listens for message received on the private session',
    'User 2 enters the secret key to establish a connection with the socket.io on the same session',
    'User 2 listens for the same incoming messages on the private session. The session is locked from interference or listening after another user joins',
    'Since there is not persisent data, the server just listens and responds to request. If the client is not listeneing, then the messages will just disppear. Meaning, if you reload or leave and join the same session, the chat history wont be present',
    'No worry of other people entering a session with the key to read your history. Once both the users leave a session, the session will be destroyed'
]);