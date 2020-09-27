<script>
	export let steps;
</script>

<section id="how">
	<div class="container" style="position: relative;">
		<h1>How anon.chat works</h1>
		<ul>
			{#each steps as step, i}
			<li><div class="circle">{i+1}</div><p>{step}</p></li>
			{/each}
		</ul>
	</div>
</section>

<style>
	ul li{
		display: flex;
		align-items: center;
		font-weight: 200;
		margin-bottom: 4rem;
	}

	.circle{
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 2rem;
		min-height: 2rem;
		background: #3F8BFE;
		border-radius: 50%;
		margin-right: 2rem;
		font-weight: 300;

	}

	#how .container{
		width: 80rem;
	}

	#how ul{
		margin: 4rem 8rem;
		margin-top: 6em;
		columns: 2;
		column-gap: 6rem;
	}

	@media only screen and (max-width: 768px) {
		#how{
			display: none;
		}
	}
</style>