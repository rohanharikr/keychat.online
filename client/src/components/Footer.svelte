<script>
	import { onMount } from 'svelte';
	import countapi from 'countapi-js';

	let hits, id;

	onMount( async ()=>{
		await countapi.visits('global').then((result) => {
  			hits = result.value
		});

		await fetch('https://api.github.com/repos/rohanharikr/chatsecure.online/commits')
			.then((response) => response.json())
			.then((data) => {
			id = data[0].sha.slice(0, 7)
		})
	})

</script>

<footer class="footer">
	<div class="footerContainer">
		<img src="chatsecureonline.svg" alt="logo" class="logo">
		<ul>
			<li>&#169; 2020 MIT License</li>
			<a href="https://www.twitter.com/rohanharikr"><li>made by rohanharikr</li></a>
			<li>{hits || '...'} happy souls</li>
			<a href="https://growwwkit.com/"><li>illustrations from growwwkit</li></a>
			<a href="https://github.com/rohanharikr/chatsecure.online">
				<li class="link" style="margin-bottom: 0.2rem;"><img src="github.svg" alt="github logo" class="footericon"></li>
			</a>
			<li>commit {id || '...'}</li>
		</ul>
		<img src="chatsecureonline.svg" alt="logo" class="mobileLogo">
	</div>
</footer>

<style>
	footer{
		margin-top: 4rem;
		background: var(--grey);
		height: 6rem;
		width: 100%;
	}

	.footerContainer{
		width: 71%;
		height: 100%;
		margin: auto;
		display: flex;
		align-items: center;
	}

	.footericon{
		height: 1rem;
		margin-right: 0.4rem;
	}

	.logo{
		filter: grayscale(100%);
		height: 2rem;
		opacity: 0.8;
	}

	.link{
		display: flex;
		align-items: center;
	}

	ul{
		columns: 3;
		font-weight: 200;
		font-size: 0.8rem;
		margin-left: 8rem;
		column-gap: 6rem;
		opacity: 0.8;
	}

	ul li{
		margin-bottom: 0.4rem;
		cursor: pointer;
		transition: 0.3s;
	}

	li:hover{
		filter: brightness(180%);
	}

	.mobileLogo{
		display: none;
	}

	@media only screen and (max-width: 768px) {
		footer{
			margin-top: 2rem;
			height: auto;
			padding: 1rem 2rem;
		}

		.footerContainer{
			width: auto;
		}

		ul{
			columns: 1;
			margin: 0;
		}

		ul li{
			margin-bottom: 0.8rem;
		}

		.logo{
			display: none;
		}

		.mobileLogo{
			margin-bottom: -0.4rem;
		}

		.mobileLogo{
			display: block;
			height: 1.6rem;
			float: right;
			margin-left: auto;
			filter: grayscale(100%);
			opacity: 0.8;
			margin-top: -4.4em;
		}
	}
</style>
