import { writable } from 'svelte/store';

export const featuresData = writable(
    [{
            title: 'Open Source',
            content: 'Open sourced under the MIT license, a permissive free software license'
        },
        {
            title: 'No login or signup',
            content: 'Easy as sharing a secret code with someone or starting a new session'
        },
        {
            title: 'Secure with NoDB',
            content: 'All messages are encrypted by AES and nothing is stored in a database'
        }
    ]
);

export const working = writable([
    'On starting a new chat, the client sends a secret key to the socket.io server',
    'The server starts a private session based on the key sent',
    'The original client listens for messages received on the private session',
    'User 2 enters the secret key to establish a connection with the socket.io on the same session',
    'All messages sent are encrypted (AES) using a key unique to the created session.',
    'Session is locked from interference or listening after another user joins',
    'Since there is not persisent data, if you reload or leave & join the same session, the history won\'t be present',
    'Once both the users leave a session, the session will be destroyed'
]);