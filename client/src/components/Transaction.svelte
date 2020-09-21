<script>
	import { slide } from 'svelte/transition';

	export let transaction;
	export let removeTransaction;
</script>

<div class="notification is-light {transaction.value > 0 ? "is-success" : "is-danger"}" transition:slide={{duration: 500}}>{transaction.value}
	<span class="is-size-7 has-text-grey date">{new Date(transaction.date).toLocaleString()}</span>
	<button class="delete" on:click={() => removeTransaction(transaction._id)}></button>
</div>

<style>
	.date{
		float: right;
	}
</style>