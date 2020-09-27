<section id="highlight">
	<div class="container">
		<h1>We don’t store any chat histories. Ever.</h1>
		<div class="sessionDeleted">
			<img src="session-deleted.svg" alt="session deleted">
			<p style="margin-right: 2rem;">All sessions are deleted after both the parties exist the room</p>
		</div>
		<div class="noInterruptions">
			<p style="margin-left: 2rem;">No intrusions or interruptions. Chat is locked once two people join a room</p>
			<img src="nointerruptions.svg" alt="no interruptions">
		</div>
		<div class="sessionDeleted" style="margin-top: -10rem;">
			<img src="opensource.svg" alt="session deleted">
			<p style="width: 14rem; margin-bottom: 0; margin-right: 2rem;">Source code is open under the MIT license</p>
		</div>
	</div>
</section>

<style>
	#highlight{
		margin: 8rem 0;
	}

	.sessionDeleted{
		margin: 6rem auto;
		width: 70%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.sessionDeleted p{
		text-align: right;
		width: 20rem;
		font-weight: 200;
		margin-bottom: 10rem;
	}

	.noInterruptions{
		margin: 6rem auto;
		margin-top: -10rem;
		width: 70%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.noInterruptions p{
		text-align: left;
		width: 20rem;
		font-weight: 200;
	}

	.sessionDeleted img, .noInterruptions img{
		height: 26rem;
	}

	@media only screen and (max-width: 768px) {
		#highlight{
			display: none;
		}
	}
</style>