<script>
	import Header from '../components/Header.svelte';
	import Features from '../components/Features.svelte';
	import Working from '../components/Working.svelte';
	import Hightlight from '../components/Hightlight.svelte';
	import Footer from '../components/Footer.svelte';
	import { featuresData, working} from '../stores.js';
	import io from 'socket.io-client';
	import secretKeyGenerator from '../utils/secretKeyGenerator'
	import { slide } from 'svelte/transition';
	import { fade, fly } from 'svelte/transition';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let socket,
		secretKey,
		isChatBox = false,
		joinKey,
		joinedSession = false,
		chatmessage,
		notification = false,
		messages = [],
		outgoing = [],
		incoming = []

	if (!socket) {
	    socket = io(':3001')
	    socket.on('botMessage', msg =>{
	    	showUserJoinedNotification(msg);
	    });
	    socket.on('sendMessage', msg =>{
	    	incoming = [...incoming, {inc: 'inc', msg}]
	    });
	}

	function showUserJoinedNotification(userName){
		notification = true;
		setTimeout(() => notification = false, 2000);
	}

	function startSession(){
		secretKey = secretKeyGenerator();
		socket.emit('secretRoom', secretKey);
		isChatBox = true;
		joinedSession = true;
	}

	function joinSession(){
		socket.emit('secretRoom', joinKey);
		isChatBox = true;
	}

	function sendMessage(){
		outgoing = [...outgoing, {inc: 'inc', msg: chatmessage}]
		if(!joinedSession){
			socket.emit('message', {user: 0, message: chatmessage});
		} else{
			socket.emit('message', {user: 1, message: chatmessage});
		}
		chatmessage = ''
	}
</script>

<Header />
	<main>
		<div class="enterSessionCard">
			{#if !isChatBox}
				<input placeholder="*****" maxlength="5" out:fly="{{ y: 200, duration: 200 }}" bind:value={joinKey}>
				<button on:click={joinSession} out:fly="{{ y: 200, duration: 200 }}">Enter with secret code</button>
			{:else}
				<div class="chatBox" transition:slide|local>
					<div class="sessionInfo flex">
						<div class="secretKey">{secretKey || joinKey}</div>
						<ul>
							<li><div class="status"></div>Chat Locked</li>
							<li><div class="status"></div>Network</li>
						</ul>
					</div>
					<div class="chatArea">
						{#if notification}
							<div class="notification" in:fly="{{y: -20, duration: 200}}" out:fly="{{ y: -20, duration: 200 }}">anon.dingo has joined the chat</div>
						{/if}
						{#each outgoing as out}
								<div class="chatBubbleBlue" in:fly="{{y: 10, duration: 300}}">{out}</div>
						{/each}
						{#each incoming as {message}}
								<div class="chatBubbleGrey">{message}</div>
						{/each}
						<!-- <div class="chatBubbleGrey">Hey, whats up bro?</div> -->
					</div>
					<div class="messageBoxContainer flex">
						<input class="messageBox" bind:value={chatmessage} placeholder="type your message here" />
						<button on:click={sendMessage}><img src="send.png" alt="send icon" class="sendIcon">Send</button>
					</div>
				</div>
			{/if}
		</div>
		{#if !isChatBox}
			<button class="newSession" on:click={startSession}>Start a new chat</button>
		{:else}
			<p class="warning" in:fade>Please do not share any personal information as there is no proper way to know who is on the other side and at the same time, keep the channel anonymous.</p>
		{/if}
	</main>

<Features features={$featuresData} />
<Hightlight />
<Working steps={$working} />
<Footer />

<style>
	main{
		width: auto;
		max-width: 24rem;
		margin: auto;
		margin-top: 0.8rem;
	}

	.enterSessionCard{
		padding: 1.2rem;
		height: auto;
		background: red;
		background: #1F1E22;
		border-radius: 0.2rem;
		border: 1px solid #35363B;
		display: flex;
		flex-direction: column;
	}

	.newSession{
		margin-top: 1rem;
	}

	.chatBox{
		height: auto;
	}

	.warning{
		font-weight: 100;
		text-align: center;
		font-size: 0.7rem;
		margin-top: 1.2rem;
		opacity: 0.8;
	}

	.messageBoxContainer{
		display: flex;
	}

	.messageBoxContainer button{
		height: 2.6rem;
		width: 6.2rem;
	}

	.messageBox{
		font-size: 1rem;
		text-align: left;
		padding: 1rem;
		margin-bottom: 0;
		width: 68%;
	}

	.sendIcon{
		height: 0.8rem;
		margin-right: 0.4rem;
	}

	.chatArea{
		height: 42vH;
		background: var(--bg-color);
		margin: 1.8rem 0;
		border-radius: 0.2rem;
		margin-top: 1.2rem;
		position: relative;
		padding: 1rem;
		text-align: center;
		/*overflow-y: scroll;*/
	}

	.secretKey{
		background: #181818;
		padding: 0.8rem;
		display: inline-block;
		border-radius: 0.2rem;
	}

	.sessionInfo ul{
		display: flex;
		font-weight: 200;
		font-size: 0.8rem;
	}

	.sessionInfo li{
		display: flex;
		align-items: center;
		margin-left: 1rem;
	}

	.status{
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: #04E887;
		margin-right: 0.4rem;
	}

	.chatBubbleBlue{
		background: #3F8BFE;
		display: table;
		padding: 0.6rem;
		border-radius: 1rem 1rem 0 1rem;
		font-size: 0.8rem;
		font-weight: 200;
		margin-left: auto;
		margin-bottom: 0.8rem;
	}

	.chatBubbleGrey{
		background: #414141;
		display: table;
		padding: 0.6rem;
		border-radius: 1rem 1rem 1rem 0;
		font-size: 0.8rem;
		font-weight: 200;
		margin-right: auto;
		margin-bottom: 0.8rem;
	}

	.notification{
	    background: #04e887;
	    display: inline-block;
	    padding: 0.2rem 0.8rem;
	    border-radius: 4rem;
	    color: black;
	    font-size: 0.8rem;
	    font-weight: 300;
	    position: absolute;
	    left: 0;
	    right: 0;
	    text-align: center;
	    margin: 0 4rem;
	}
</style>
