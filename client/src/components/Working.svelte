<script>
  export let steps
</script>

<style>
  ul li {
    display: flex;
    align-items: center;
    font-weight: 400;
    margin-bottom: 4rem;
  }

  .circle {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 2rem;
    min-height: 2rem;
    background: #3f8bfe;
    border-radius: 50%;
    margin-right: 2rem;
    font-weight: 600;
  }

  .container {
    max-width: 64rem;
  }

  #how ul {
    /*margin: 4rem 8rem;*/
    margin-top: 4em;
    columns: 2;
    column-gap: 6rem;
    margin-bottom: 0;
  }

  @media only screen and (max-width: 768px) {
    #how .container {
      width: auto;
    }

    ul li {
      margin-bottom: 2.2rem;
    }

    #how ul {
      margin: 1rem;
      columns: 1;
      font-size: 0.8rem;
      margin-top: 2.6rem;
    }

    .circle {
      margin-right: 1rem;
    }
  }
</style>

<section id="how">
  <div class="container" style="position: relative;">
    <h1>How keychat.online works?</h1>
    <ul>
      {#each steps as step, i}
        <li>
          <div class="circle">{i + 1}</div>
          <p>{step}</p>
        </li>
      {/each}
    </ul>
  </div>
</section>
