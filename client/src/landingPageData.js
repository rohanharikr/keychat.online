export const featuresData = [
  {
    title: 'Public key encrypted',
    content:
      'Messages are encrypted using elliptic curve Diffie-Hellman key exchange',
  },
  {
    title: 'Open Source',
    content:
      'Open sourced under the MIT license, a permissive free software license',
  },
  {
    title: 'No login or signup',
    content:
      'Easy as sharing a secret code with someone or starting a new session',
  },
]

export const working = [
  'On starting a new chat, the client sends a room key and public key to the socket.io server',
  'The server starts a private session based on the room key',
  'On entering a valid room key, a connection is established with the socket.io server',
  'A public key is then generated and broadcasted to the listener of the same session',
  'All messages are encypted / decrypted using elliptic curve Diffie-Hellman key exchange',
  'Locked from interference or listening when a total of two users are present in a session',
  "Since there is no persisent data, if you reload or leave & join the same session, the history won't be present",
  'Once both the users leave a session, the session will be destroyed',
]
