<script>
	import '../app.postcss';
	import Logo from './Logo.svelte';

	let isActive = false;
</script>

<Logo {isActive} />
<slot />
