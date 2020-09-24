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
	import copy from 'copy-to-clipboard';

 	let socket,
		secretKey,
		isChatBox = false,
		joinKey = '',
		//set to true when clicked on "join a session"
		joinedSession = false,
		chatmessage,
		// to control visibility of the notification, has a timeout
		// attached in the function to set to false
		notification = false,
		messages = [],
		notificationMessage,
		isCopied,
		isChatLocked = false,
		inputRef,
		sessionInProgress = false,
		isLoading = false

	//connect to socket.io server
	if(!socket){
    socket = io(':3001')

    //listen for notification message
    socket.on('botMessage', status => {
    	let botMessage;
    	//status 1 = joined, 0 = disconnected
    	if(status === 1){
    		botMessage = 'has joined the chat';
    		isChatLocked = true
    	} else{
    		botMessage = 'has left the chat';
    		isChatLocked = false
    	}
    	showNotification(botMessage);
    });
    }

    //sends a message to server
    socket.on('sendMessage', msg =>{
    	messages = [...messages, {way: 'inc', msg}]
    });

	function showNotification(msg){
		notification = true;
		notificationMessage = msg;
		setTimeout(() => notification = false, 2000);
	}

	function startSession(){
		secretKey = secretKeyGenerator();
		socket.emit('newRoom', secretKey);
		isChatBox = true;
	}

	function joinSession(){
		isLoading = true;
		socket.emit('joinRoom', joinKey)
		socket.on('sessionLocked', () => {
			sessionInProgress = true;
		});	

		// this is a bady way to write this, need to use promise
		setTimeout(() => { 
			 if(!sessionInProgress){
				isChatBox = true;
				joinedSession = true;
			} else{
				isLoading = false;
				showNotification('Session does not exist');
			}
		}, 1500)
	}

	function sendMessage(){
		messages = [...messages, {way: 'out', msg: chatmessage}]
		socket.emit('message', chatmessage);
		chatmessage = '';
		inputRef.focus()
	}

	function copySecretKey(){
		isCopied = !isCopied;
		if (secretKey){
			copy(secretKey)
		} else {
			copy(joinKey)
		} 
		showNotification("Secret Key copied to clipboard")
		setTimeout(() => isCopied = false, 1250);
	}

	function checkEnterPress(event){
		let key;
		let keyCode;
		key = event.key;
		keyCode = event.keyCode;
		if (keyCode === 13 && chatmessage){
			sendMessage();
		} else if(keyCode === 13 && joinKey){
			startSession()
		}
	}

	// function updateScroll() {
	// 	const chatWindow = document.getElementById('chatWindow');
 //  		setTimeout(() => {
 //    		chatWindow.scrollTop = chatWindow.scrollHeight; 
 //  		}, 0);
	// }
</script>

<Header />
<main>
	<div class="enterSessionCard">
		{#if !isChatBox}
			<input placeholder="*****" maxlength="5" out:fly="{{ y: 200, duration: 200 }}" bind:value={joinKey} on:keydown={checkEnterPress}>
			{#if notification}
				<div transition:slide class="error">
					{notificationMessage}
				</div>
			{/if}
			<button on:click={joinSession} out:fly="{{ y: 200, duration: 200 }}" style="background: #1f1e22" disabled={isLoading} class:focus={joinKey.length}>
				{#if !isLoading}
					Enter with secret code
				{:else}
					<img src="loader.gif" alt="loading gif" class="loaderAnim">
				{/if}
			</button>
		{:else}
			<div class="chatBox" transition:slide|local>
				<div class="sessionInfo flex">
					<div class="secretKey">
						<img src="secretkey.svg" alt="secret key" class="secretKeyIcon">
						<div>{secretKey || joinKey}</div>
						<img src={isCopied ? "copied.svg" : "copy.svg"} alt="copied icon" class="copyIcon" on:click={copySecretKey}>
					</div>
					<ul>
						<li>
							<div class={isChatLocked ? 'status' : joinedSession ? 'status' : 'status red'}></div>
							Chat {isChatLocked ? 'Locked' : joinedSession ? 'Locked' : 'Open'}
						</li>
						<li><div class="status"></div>Network</li>
					</ul>
				</div>
				<div class="chatArea">
					{#if notification}
						<div class="notification" in:fly="{{y: -20, duration: 200}}" out:fly="{{ y: -20, duration: 200 }}">
							{notificationMessage}
						</div>
					{/if}
					{#each messages as {way, msg}}
						{#if way === 'out'}
							<div class="chatBubbleBlue" in:fly="{{y: 10, duration: 300}}">{msg}</div>
						{:else}
							<div class="chatBubbleGrey" in:fly="{{y: 10, duration: 300}}">{msg}</div>
						{/if}
					{/each}
					<!-- <div class="chatBubbleGrey">Hey, whats up bro?</div> -->
				</div>
				<div class="messageBoxContainer flex">
					<input class="messageBox" bind:value={chatmessage} placeholder="type your message here" bind:this={inputRef}  on:keydown={checkEnterPress} autofocus/>
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

	.blur{
		background: #1f1e22;
	}

	.focus{
		background: #6976f7 !important;
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
		height: 2.8rem;
		padding: 0 0.4rem;
		display: inline-block;
		border-radius: 0.2rem;
		font-weight: 200;
		display: flex;
		align-items: center;
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

	.loaderAnim{
		height: 2.4rem;
	}

	.copyIcon{
		height: 2rem;
	}

	.error{
		text-align: center;
		margin-bottom: 1rem;
		font-weight: 200;
		font-size: 1rem;
		color: red;
	}

	.secretKey div{
		margin: 0 1rem;
	}

	.secretKeyIcon {
		height: 1rem;
		margin-right: -0.5rem;
	}

	.red{
		background: #F91C1C;
	}
</style>
