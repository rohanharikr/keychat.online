<script>
	import '../app.postcss';
	import Logo from './Logo.svelte';

	let isActive = true;
</script>

<Logo {isActive} />
<slot />
