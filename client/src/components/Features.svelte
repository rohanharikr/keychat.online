<script>
	export let features;
</script>

<section id="features">
	<div class="container flex">
		{#each features as feature}
			<div class="featuresCard">
				<h1>{feature.title}</h1>
				<p>{feature.content}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	#features{
		margin-top: 10rem;
		height: auto;
		margin-bottom: 2rem;
	}

	.featuresCard{
		background: #1F1E22;
		width: 18rem;
		height: 12rem;
		padding: 2rem;
		border-radius: 0.2rem;
	}

	.featuresCard h1{
		font-size: 1.2rem;
		font-weight: 300;
	}

	.featuresCard p{
		margin-top: 1rem;
		font-size: 1rem;
		font-weight: 100;
		opacity: 0.8;
	}

	@media only screen and (max-width: 768px) {
		#features{
			display: none;
		}
	}
</style>

