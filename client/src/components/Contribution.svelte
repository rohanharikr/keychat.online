<script>
  import { slide } from 'svelte/transition'
  let expand = false
</script>

<style>
  .contribution {
    font-size: 0.8rem;
    border: 1px solid var(--border-grey);
    padding: 0.6rem 1.2rem;
    border-radius: 0.4rem;
    margin: 2rem 0;
    margin-bottom: 0;
  }

  .content {
    display: inline-block;
    width: 80%;
    color: #808080;
  }

  img {
    height: 0.46rem;
  }

  p {
    margin-top: 0.4rem;
    font-weight: 300;
    opacity: 0.9;
  }

  .coffewrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fd0;
    border-radius: 0.4rem;
    margin: 0.8rem 0;
  }

  .flipImage {
    -webkit-transform: scaleY(-1);
    transform: scaleY(-1);
  }
</style>

<div class="contribution">
  <div
    class="flex"
    style="cursor: pointer;"
    on:click={() => {
      expand = !expand
    }}>
    <span class="content">If you find this product useful, please consider
      supporting</span>
    <img src="assets/downarrow.svg" alt="down arrow" class:flipImage={expand} />
  </div>
  {#if expand}
    <div transition:slide style="margin-top: 1rem;">
      <h4>How your contribution is used?</h4>
      <p>
        Your generous contribution will easily cover the server, domain renewal
        costs and help keep this product free for everyone.
      </p>
      <p>If you have any queries, please reach out to hi@keychat.online</p>
      <a href="https://www.buymeacoffee.com/KEJSRzZ" target="_blank">
        <div class="coffewrapper">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            style="height: 2.8rem !important;" />
        </div>
      </a>
    </div>
  {/if}
</div>
