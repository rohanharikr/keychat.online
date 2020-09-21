<script>
	export let value = 0;
	export let mode = "balance"
	$: label = mode.toUpperCase()
	$: cssClass = getCssClass(mode)

	function getCssClass(mode){
		switch(mode){
			case 'balance':
				return 'is-info';
			case 'income':
				return 'is-success';
			case 'expenses':
				return 'is-danger';
		}
	}
</script>

<div class="notification {cssClass} is-light has-text-centered">
	{label}:
	<strong>{value}</strong>
</div>