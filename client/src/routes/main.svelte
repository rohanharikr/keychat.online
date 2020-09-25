<script>
import io from 'socket.io-client';
import codegen from '../utils/secretKeyGenerator';
// import isOnline from 'is-online';

let socket, message;
let history = []
let isChatVisible = false
let randomizer;
let code;

function sendMessage(value){
	socket.emit('chatMessage', message);
}


function startSession(){
	randomizer = codegen();
	socket.emit('room-info', randomizer);
	isChatVisible = true
}

if (!socket) {
    socket = io(':3001')
    socket.on('botMessage', msg =>{
    	history = [...history, msg]
    });
    socket.on('message', msg =>{
    	history = [...history, msg]
    });
}

function joinChat(){
	socket.emit('room-info', code);
	isChatVisible = true;
}

</script>

{#if isChatVisible}
	{#each history as bubble}
		<div>{bubble}</div>
	{/each}
<input placeholder="type something" bind:value={message}>
<button on:click={()=>sendMessage(message)}>Send the message goddamit</button>
{:else}
<input bind:value={code} />
<button on:click={joinChat}>Join chat</button>
<br>
<button on:click={startSession}>start a new chat</button>
{/if}


