<script>
	import Header from '../components/Header.svelte';
	import Features from '../components/Features.svelte';
	import Working from '../components/Working.svelte';
	import Hightlight from '../components/Hightlight.svelte';
	import Footer from '../components/Footer.svelte';
	import { featuresData, working} from '../stores.js';
	import io from 'socket.io-client';
	import secretKeyGenerator from '../utils/secretKeyGenerator';
	import { slide } from 'svelte/transition';
	import { fade, fly } from 'svelte/transition';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import copy from 'copy-to-clipboard';
	import AnimalAvatar from 'animal-avatars.js';
	import { onMount } from 'svelte';
	import getTime from '../utils/getTime';
	import * as AES from '../utils/encrypt';
	import isOnline from 'is-online';

 	let socket,
		secretKey,
		isChatBox = false,
		joinKey = '',
		joinedSession = false,
		chatmessage = '',
		notification = false,
		messages = [],
		notificationMessage,
		isCopied,
		isChatLocked = false,
		inputRef,
		sessionInProgress = false,
		isLoading = false,
		user = new AnimalAvatar(),
		anon = new AnimalAvatar(),
		isTyping = false,
		network = true,
		chatArea,
		encKey;

	let userName,
	 	userAvatar,
	 	anonName,
	 	anonAvatar;

 // 	setInterval(async() => {
	// 	network = await isOnline();
	// }, 1000);

 	// $: if(!network && isChatBox){
		// showNotification('You are offline', 'red');
 	// }
 	// else if (network && isChatBox && messages.length){
 	// 	showNotification('You are back online', 'green');
 	// }

	//connect to socket.io server
	if(!socket){
	    socket = io(':3001')

	    //listen for notification message
	    socket.on('botMessage', status => {
	    	let botMessage;
	    	//status 1 = joined, 0 = disconnected
	    	if(status === 1){
	    		botMessage = `${userName} has joined the chat`;
	    		isChatLocked = true;
	    		showNotification(botMessage, 'green');
	    	} else{
	    		botMessage = `${userName} has left the chat`;
	    		isChatLocked = false
	    		showNotification(botMessage, 'red');
	    	}
	    });
    }

	socket.on('userData', data => {
		encKey = data.encKey;
		anonName = data.anonName;
		anonAvatar = data.anonAvatar;
		userName = data.userName;
		userAvatar = data.userAvatar;
	})

    socket.on('sendMessage', msg =>{
    	const decryptedMessage = AES.decrypt(msg, encKey);
    	console.log(decryptedMessage);
    	messages = [...messages, decryptedMessage];
    	updateScroll();
    });

	function showNotification(msg, color){
		notification = true;
		notificationMessage = {msg, color};
		setTimeout(() => notification = false, 3000);
	}

	socket.on('typing', () => {
		isTyping = true;
	});

	socket.on('noLongerTyping', () => {
		isTyping = false;
	});

	function startSession(){
		encKey = secretKey + secretKeyGenerator();
		userName = user.getAvatarName(),
	 	userAvatar = user.getAvatarUrl(),
		anonName = anon.getAvatarName(),
	 	anonAvatar = anon.getAvatarUrl(),
		secretKey = secretKeyGenerator();
		socket.emit('newRoom', {secretKey, userName, userAvatar, anonName, anonAvatar, encKey});
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
				showNotification('Session does not exist', 'red');
			}
		}, 1500)
	}

	function sendMessage(){
		messages = [...messages, {way: 'out', msg: chatmessage, time: getTime()}];
		const data = {way: 'in', msg: chatmessage, time: getTime()};
		const ciphertext = AES.encrypt(data, encKey);
		socket.emit('message', ciphertext);
		chatmessage = '';
		inputRef.focus()
		updateScroll();
	}

	function copySecretKey(){
		isCopied = !isCopied;
		if (secretKey){
			copy(secretKey)
		} else {
			copy(joinKey)
		} 
		showNotification("Secret Key copied", 'green')
		setTimeout(() => isCopied = false, 1250);
	}

	//local vars
	let typing = false, 
		timeout = undefined;

	function timeoutFunction(){
		typing = false;
		socket.emit('noLongerTypingMessage');
	}

	function checkEnterPress(event){
		let key;
		let keyCode;
		key = event.key;
		keyCode = event.keyCode;

		if (keyCode === 13 && chatmessage.length){
			sendMessage();
		} else if(keyCode === 13 && joinKey){
			joinSession();
		}

		if(typing == false && chatmessage) {
	    	typing = true;
	    	socket.emit('typingMessage');
	    	timeout = setTimeout(timeoutFunction, 1000);
	  	} else {
	    	clearTimeout(timeout);
	    	timeout = setTimeout(timeoutFunction, 800);
	  	}
	}

	function updateScroll() {
		setTimeout(() => {
    		chatArea.scrollTop = chatArea.scrollHeight;   
  		}, 0);
	}
</script>
<div class="main-container">
<Header />
<main>
	<div class="enterSessionCard">
		{#if !isChatBox}
			<input placeholder="*****" maxlength="5" bind:value={joinKey} on:keydown={checkEnterPress}>
			{#if notification}
				<div transition:slide class="error" class:redtext={notificationMessage.color === 'red'}>
					{notificationMessage.msg}
				</div>
			{/if}
			<button on:click={joinSession} style="background: #1f1e22" disabled={!joinKey.length} class:focus={joinKey.length}>
				{#if !isLoading}
					Enter with secret code
				{:else}
					<img src="loader.gif" alt="loading gif" class="loaderAnim">
				{/if}
			</button>
		{:else}
		<!-- this is just here to laod the image, avoid the delay when rendering in the real case -->
		<div style="background-image: url({userAvatar})"></div>
		<div style="background-image: url({anonAvatar})"></div>
			<div class="chatBox" transition:slide>
				<div class="sessionInfo flex" in:fade={{duration: 500}}>
					<div class="secretKey">
						<!-- <img src="secretkey.svg" alt="secret key" class="secretKeyIcon"> -->
						<div>{secretKey || joinKey}</div>
						<img src={isCopied ? "copied.svg" : "copy.svg"} alt="copied icon" class="copyIcon" on:click={copySecretKey}>
					</div>
					<ul>
						<li>
							<div class={isChatLocked ? 'status' : joinedSession ? 'status' : 'status red'}></div>
							Chat {isChatLocked ? 'Locked' : joinedSession ? 'Locked' : 'Open'}
						</li>
						<li><div class="status" class:red={!network}></div>Network</li>
					</ul>
				</div>
				<div class="chatArea" in:fade={{duration: 500}} bind:this={chatArea}>
					{#if notification}
						<div class="notification" in:fly="{{y: -20, duration: 200}}" out:fly="{{ y: -20, duration: 200 }}" class:red={notificationMessage.color === 'red'}>
							{notificationMessage.msg}
						</div>
					{/if}
					{#each messages as {way, msg, time}}
						{#if way === 'out'}
							<div class="chatBubbleContainer" style="margin-right: -0.4rem" in:fly="{{y: 10, duration: 300}}">
								<div class="chatBubbleBlue">{msg}</div>
								{#if !joinedSession}
									<div class="avatar avatarUser" style="background-image: url({userAvatar})"></div>
								{:else}
									<div class="avatar avatarUser" style="background-image: url({anonAvatar})"></div>
								{/if}
							</div>
							<div class="timeStamp timeStampUser" in:fly="{{y: 10, duration: 300}}">{time}</div>
						{:else}
							<div class="chatBubbleContainer" in:fly="{{y: 10, duration: 300}}">
								{#if !joinedSession}
									<div class="avatar avatarAnon" style="background-image: url({anonAvatar})"></div>
								{:else}
									<div class="avatar avatarAnon" style="background-image: url({userAvatar})"></div>
								{/if}
								<div class="chatBubbleGrey">{msg}</div>
							</div>
							<div class="timeStamp timeStampAnon" in:fly="{{y: 10, duration: 300}}">{time}</div>
						{/if}
					{/each}
					{#if isTyping}
						<div class="chatBubbleContainer" in:fly="{{y: 10, duration: 300}}" out:fly="{{y: 10, duration: 100}}">
							<div class="chatBubbleGrey typingAnimContainer"><img src="typing.gif" alt="typing anim" class="typingAnim"></div>
						</div>
					{/if}
				</div>
				<div class="messageBoxContainer flex" in:fade={{duration: 500}}>
					<input class="messageBox" bind:value={chatmessage} placeholder="type your message here" bind:this={inputRef}  on:keydown={checkEnterPress}/>
					<button on:click={sendMessage} disabled={!chatmessage.length}><img src="send.png" alt="send icon" class="sendIcon">Send</button>
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
</div>
<Footer />

<style>
	main{
		width: auto;
		max-width: 24rem;
		margin: auto;
		margin-top: 0.8rem;
	}

	.main-container{
		margin: 0 1rem;
	}

	.chatBubbleContainer{
		display: flex;
		justify-content: center;
		align-items: inherit;
	}

	.typingAnimContainer{
		padding: 0;
		height: 2.2rem;
		width: 3.8rem;
		display: flex !important;
		justify-content: center !important;
		align-items: center !important;
	}

	.typingAnim{
		height: 1.6rem;
	}

	button:disabled,
	button[disabled]{
  		background-color: #3c3c3c;
  		pointer-events: none;
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

/*	.alias{
		font-size: 0.6rem;
		opacity: 0.5;
		margin: -0.2rem 0;
    	margin-bottom: -0.2rem;
		margin-bottom: 0.1rem;
		text-align: right;
	}*/

	.focus{
		background: #6976f7 !important;
	}

	.avatar{
		width: 2.3rem;
		height: 2.3rem;
		border-radius: 50%;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		
	}

	.avatarUser{
		margin-left: 0.6rem;
	}

	.avatarAnon{
		margin-right: 0.6rem;
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

	.timeStamp{
		font-weight: 100;
		font-size: 0.6rem;
		margin-top: -0.8em;
		margin-bottom: 1.8rem;
		opacity: 0.8;
	}

	.timeStampUser{
		text-align: right;
		margin-right: 2.8rem;
	}

	.timeStampAnon{
		text-align: left;
		margin-left: 2.9rem;
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
		overflow-y: scroll;
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

/*	.secretKeyIcon {
		height: 1rem;
		margin-right: -0.5rem;
	}*/

	.red{
		background: #F91C1C;
		color: white !important;
	}

	.redtext{
		color: #F91C1C;
	}
</style>
