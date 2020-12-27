<script>
  export let features
</script>

<style>
  #features {
    margin-top: 8rem;
    height: auto;
    margin-bottom: 2rem;
  }

  .featuresCard {
    background: var(--grey);
    width: 18rem;
    height: 12rem;
    padding: 2rem;
    border-radius: 0.2rem;
  }

  .featuresCard h1 {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .featuresCard p {
    margin-top: 1rem;
    font-size: 1rem;
    font-weight: 300;
    opacity: 0.8;
  }

  @media only screen and (max-width: 912px) {
    #features {
      margin-top: 4rem;
      overflow-x: scroll;
    }

    .container {
      width: 40rem;
    }

    .featuresCard {
      height: 8rem;
      width: 12rem;
      padding: 1rem;
      /*margin-right: 1rem;*/
    }

    .featuresCard h1 {
      font-size: 1rem;
    }

    .featuresCard p {
      font-size: 0.8rem;
    }
  }
</style>

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
