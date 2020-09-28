<script>
	export let src = "chatsecureoffline.svg";
</script>

<header>
	<img {src} alt="logo">
</header>

<style>
	header{
		text-align: center;
		height: 6rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	img{
		height: 2.2rem;
	}

	@media only screen and (max-width: 768px) {
		header{
			height: 4rem;
			margin-bottom: -0.8rem;
		}

		img{
			height: 1.8rem;
		}
	}
</style>