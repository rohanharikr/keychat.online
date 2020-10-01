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
	import getTime from '../utils/getTime';
	import FileSaver from 'file-saver';
	import InternetConnection from "svelte-internet-connection";
	import nacl from 'tweetnacl';
	import naclUtil from 'tweetnacl-util';

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
		isLoadingJoin = false,
		isLoadingStart = false,
		user = new AnimalAvatar(),
		anon = new AnimalAvatar(),
		isTyping = false,
		network = true,
		chatArea,
		encKey,
		chatOptions = false;

	let userName,
	 	userAvatar,
	 	anonName,
	 	anonAvatar;

	let userPublicKey,
		userPrivateKey,
		anonPublicKey,
		anonPrivateKey,
		nonce;

	 $: if (chatmessage === "/" || chatmessage[chatmessage.length-1] == "/"){
		chatOptions = true;	 	
	 } else{
	 	chatOptions = false;
	 }

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
		nonce = naclUtil.decodeBase64(data.nonce);
		userPublicKey = naclUtil.decodeBase64(data.userPublicKey);
		anonPublicKey = naclUtil.decodeBase64(data.anonPublicKey);
	})

    socket.on('sendMessage', message => {
    	let payload, utf8, boxData;
    	boxData = naclUtil.decodeBase64(message);
    	if(!joinedSession){
			payload = nacl.box.open(boxData, nonce, anonPublicKey, userPrivateKey)
			utf8 = JSON.parse(naclUtil.encodeUTF8(payload));
		} else{
			payload = nacl.box.open(boxData, nonce, userPublicKey, anonPrivateKey)
			utf8 = JSON.parse(naclUtil.encodeUTF8(payload));
			
		}
		messages = [...messages, utf8];
    	updateScroll();
    });

	function showNotification(msg, color){
		notification = true;
		notificationMessage = {msg, color};
		setTimeout(() => notification = false, 2000);
	}

	socket.on('typing', () => {
		isTyping = true;
	});

	socket.on('noLongerTyping', () => {
		isTyping = false;
	});

	function startSession(){
		const keys = nacl.box.keyPair();
		userPublicKey = keys.publicKey;
		userPublicKey = naclUtil.encodeBase64(userPublicKey);
		console.log(`YOUR PUBLIC KEY BASE64: ${userPublicKey}`);
		nonce = naclUtil.encodeBase64(nacl.randomBytes(24));

		secretKey = secretKeyGenerator();
		encKey = secretKey + secretKeyGenerator();
		userName = user.getAvatarName(),
	 	userAvatar = user.getAvatarUrl(),
		anonName = anon.getAvatarName(),
	 	anonAvatar = anon.getAvatarUrl(),
		socket.emit('newRoom', {secretKey, userName, userAvatar, anonName, anonAvatar, encKey, userPublicKey, nonce});
		isLoadingStart = true;
		setTimeout(() => {
			isLoadingStart = false;
			isChatBox = true
		}, 300) //ux
	}

	function joinSession(){
		const keys = nacl.box.keyPair();
		anonPublicKey = keys.publicKey;
		anonPublicKey = naclUtil.encodeBase64(anonPublicKey);
		console.log(`YOUR PUBLIC KEY BASE64: ${anonPublicKey}`);
		anonPrivateKey = keys.secretKey;

		isLoadingJoin = true;
		socket.emit('joinRoom', {joinKey, anonPublicKey})
		socket.on('sessionLocked', () => {
			sessionInProgress = true;
		});	

		// this is a bad way to write this, need to use promise
		setTimeout(() => { 
			 if(!sessionInProgress){
				isChatBox = true;
				joinedSession = true;
				isChatLocked = true;

			} else{
				isLoadingJoin = false;
				showNotification('Session does not exist', 'red');
			}
		}, 1500)
	}

	function closeSession(){
		isChatBox = false;
		chatmessage = '';
		messages = [];
		joinKey = '';
		joinedSession = false;
		chatmessage = '';
		notification = false;
		isChatLocked = false;
		sessionInProgress = false;
		isLoadingJoin = false;
		isLoadingStart = false;
		isTyping = false;
		network = true;
		chatArea;
		encKey;
		chatOptions = false;
		userName = false;
		anonName = false;
		userAvatar = false;
		anonAvatar = false;
	}

	function sendMessage(){
		messages = [...messages, {way: 'out', msg: chatmessage, time: getTime()}];
		let data = JSON.stringify({way: 'in', msg: chatmessage, time: getTime()});
		let box;
		if(joinedSession){
			box = nacl.box(
  			naclUtil.decodeUTF8(data),
  			nonce,
  			userPublicKey,
  			anonPrivateKey)
		} else{
			box = nacl.box(
  			naclUtil.decodeUTF8(data),
  			nonce,
  			anonPublicKey,
  			userPrivateKey)
		}

		console.log(box);
		box = naclUtil.encodeBase64(box);
		socket.emit('message', box);
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

	async function saveHistory(){
		const data = JSON.stringify(messages);
		const blob = await new Blob([data], {type: "text/plain;charset=utf-8"});
		FileSaver.saveAs(blob, `${secretKey || joinKey}.txt`);
	}

	function checkEnterPress(event){
		let key;
		let keyCode;
		key = event.key;
		keyCode = event.keyCode;

		if(keyCode === 13 && !isChatBox && !joinKey.length && !chatmessage.length){
			startSession();
		} else if(keyCode === 13 && joinKey.length && !isChatBox && !chatmessage.length){
			joinSession();
		}

		if(keyCode === 13 && chatmessage.length && isChatBox){
			sendMessage();
		}
		
		if(typing === false && chatmessage) {
	    	typing = true;
	    	socket.emit('typingMessage');
	    	timeout = setTimeout(timeoutFunction, 200);
	  	} else if(typing === true && chatmessage){
	    	clearTimeout(timeout);
	    	timeout = setTimeout(timeoutFunction, 200);
	  	}
	}

	function updateScroll() {
		setTimeout(() => {
    		chatArea.scrollTop = chatArea.scrollHeight;  
  		}, 0);
	}
</script>

<!-- causing a lot of bugs, will fix -->
<!-- <svelte:window on:keydown={checkEnterPress}/> -->
<div class="main-container" class:modifier={isChatBox}>
<div class:modifier--displayNone={isChatBox}>
	<Header src={isChatBox ? "chatsecureonline.svg" : "chatsecureoffline.svg"} />
</div>
<main class:main--modifier={isChatBox}>
	<div class="enterSessionCard" class:enterSessionCard--modifier={isChatBox}>
		{#if !isChatBox}
			<input placeholder="*****" minlength="5" maxlength="5" bind:value={joinKey} on:keydown={checkEnterPress}>
			{#if notification}
				<div transition:slide class="error" class:redtext={notificationMessage.color === 'red'}>
					{notificationMessage.msg}
				</div>
			{/if}
			<button on:click={joinSession} style="background: #1f1e22" disabled={!joinKey.length} class:focus={joinKey.length}>
				{#if !isLoadingJoin}
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
						<div data-tooltip="Share this secret code with anyone to start chatting">{secretKey || joinKey}</div>
						<img src={isCopied ? "copied.svg" : "copy.svg"} alt="copied icon" class="copyIcon" on:click={copySecretKey}>
					</div>
					<ul>
						<li data-tooltip="Locked once another user enters the chat" style="cursor: pointer;">
							<div class={isChatLocked ? 'status' : joinedSession ? 'status' : 'status red'}></div>
							Chat {isChatLocked ? 'Locked' : joinedSession ? 'Locked' : 'Open'}
						</li>
						<li data-tooltip="Indicates if you are online or not" style="cursor: pointer;">
							<InternetConnection let:status>
								<div class="status" class:red={status === 'offline'}></div>
							</InternetConnection>
							Network
						</li>
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
							<div class="chatBubbleContainer" in:fly="{{y: 10, duration: 300}}">
								<div class="chatBubbleBlue">{msg}</div>
								{#if !joinedSession}
									<div class="avatar avatarUser tooltip-bottom-right" style="background-image: url({userAvatar}); font-size: 0.8rem;" data-tooltip={userName}></div>
								{:else}
									<div class="avatar avatarUser tooltip-bottom-right" style="background-image: url({anonAvatar}); font-size: 0.8rem;" data-tooltip={anonName}></div>
								{/if}
							</div>
							<div class="timeStamp timeStampUser" in:fly="{{y: 10, duration: 300}}">{time}</div>
						{:else}
							<div class="chatBubbleContainer" in:fly="{{y: 10, duration: 300}}">
								{#if !joinedSession}
									<div class="avatar avatarAnon tooltip-bottom-left" style="background-image: url({anonAvatar}); font-size: 0.8rem;" data-tooltip={anonName}></div>
								{:else}
									<div class="avatar avatarAnon tooltip-bottom-left" style="background-image: url({userAvatar}); font-size: 0.8rem;" data-tooltip={userName}></div>
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
				{#if chatOptions}
					<ul class="chatOptions" transition:slide>
						<li on:click={closeSession}><img src="close.png" alt="close icon"><div>close</div></li>
						<li on:click={()=>{messages = []}}><img src="clear.png" alt="clear icon"><div>clear</div></li>
						<li on:click={saveHistory}><img src="download.png" alt="download icon"><div>download</div></li>
					</ul>
				{/if}		
				{#if !isChatLocked}	
					<div class="loadingChat" transition:slide data-tooltip="Messages sent now are not received by the end user">
						<img src="loader.gif" alt="loading animation" class="loading">
						<p>waiting for a user to join...</p>
					</div>
				{/if}
				<div class="messageBoxContainer flex" in:fade={{duration: 500}}>
					<input class="messageBox" bind:value={chatmessage} placeholder="type your message here" bind:this={inputRef}  on:keydown={checkEnterPress} disabled={!isChatLocked} />
					<button on:click={sendMessage} disabled={!chatmessage.length || chatmessage === "/"}><img src="send.png" alt="send icon" class="sendIcon">Send</button>
				</div>
				{#if !chatOptions}
					<p class="chatOptionsHelper" transition:slide>type '/' for chat options</p>
				{/if}
				<img src="chatsecureoffline.svg" alt="logo" class="chatBoxLogo">
			</div>
		{/if}
	</div>
	{#if !isChatBox}
		<button class="newSession" on:click={startSession}>
			{#if !isLoadingStart}
				Start a new chat
			{:else}
				<img src="loader.gif" alt="loading gif" class="loaderAnim">
			{/if}
		</button>
	{:else}
		<p class="warning" in:fade class:modifier--displayNone={isChatBox}>Please do not share any personal information as there is no proper way to know who is on the other side and at the same time, keep the channel anonymous.</p>
	{/if}
</main>
<div class:mobileChatActive={isChatBox}>
	<Features features={$featuresData} />
</div>
<div class:mobileChatActive={isChatBox}>
	<Hightlight />
</div>
<div class:mobileChatActive={isChatBox}>
	<Working steps={$working} />
</div>
</div>
<div class:mobileChatActive={isChatBox}>
	<Footer />
</div>

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

	.loadingChat{
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
	}

	.loadingChat p{
		font-size: 0.8rem;
		margin-left: 0.3rem;
		font-weight: 200;
	}

	.loading{
		height: 1.2rem;
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
		width: 28%;
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
		margin-bottom: 1rem;
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

	.chatOptions{
		margin-bottom: 0.8rem;
		display: flex;
		align-items: center;
		border-radius: 0.2rem;
	}

	.chatOptions li{
		list-style: none;
		font-weight: 100;
		font-size: 1rem;
		background: #242424;
		padding: 0.6rem 1rem;
		border-radius: 0.2rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		margin-right: 0.8rem;
	}

	.chatOptions img{
		height: 0.8rem;
		margin-right: 0.4rem;
	}

	.chatOptionsHelper{
		font-weight: 300;
		margin-left: 1rem;
		margin-top: 0.8rem;
		opacity: 0.6;
		font-size: 0.6rem;
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

	.red{
		background: #F91C1C;
		color: white !important;
	}

	.redtext{
		color: #F91C1C;
	}

	.chatBoxLogo{
		display: none;
	}

	@media only screen and (max-width: 768px) {
		main{
			overflow-x: hidden;
		}

		.main--modifier{
			margin: 0;
			max-width: inherit;
		}

		.chatBoxLogo{
			display: block;
			height: 1.2rem;
			float: right;
			filter: grayscale(100%);
			opacity: 0.6;
			margin-top: 0.4rem;
		}

		.mobileChatActive{
			display: none;
		}

		.modifier{
			margin: 0;
		}

		.chatArea{
			height: 66vH;
		}

		.enterSessionCard--modifier{
			height: 100%;
			border: none;
		}

		.modifier--displayNone{
			display: none;
		}
  	}
</style>
