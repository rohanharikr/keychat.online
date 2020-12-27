<style>
  #highlight {
    margin: 8rem 0;
  }

  .sessionDeleted,
  .noInterruptions {
    margin: 4rem auto;
    width: 70%;
  }

  .sessionDeleted p {
    text-align: right;
    width: 20rem;
    font-weight: 400;
    margin-bottom: 10rem;
  }

  .noInterruptions {
    margin-top: -10rem;
  }

  .noInterruptions p {
    text-align: left;
    width: 20rem;
    font-weight: 400;
  }

  .sessionDeleted img,
  .noInterruptions img {
    height: 24rem;
  }

  .modifier {
    margin-top: -10rem;
  }

  @media only screen and (max-width: 768px) {
    #highlight h1 {
      margin-bottom: 2rem;
    }

    .modifier {
      margin-top: 0;
    }

    #highlight {
      margin: 4rem 0;
    }

    .container {
      width: auto;
    }

    .sessionDeleted img,
    .noInterruptions img {
      height: 12rem;
    }

    .sessionDeleted,
    .noInterruptions {
      margin: 0 auto;
      width: 100%;
    }

    .noInterruptions img {
      margin-right: 2rem;
    }

    p {
      font-size: 0.9rem;
    }

    .sessionDeleted p {
      margin-bottom: 4rem;
      margin-left: 0.9rem;
    }

    .sessionDeleted img {
      margin-left: 2rem;
    }
  }
</style>

<section id="highlight">
  <div class="container">
    <h1>We don’t store any chat histories. Ever.</h1>
    <div class="sessionDeleted flex">
      <img src="assets/session-deleted.svg" alt="session deleted" />
      <p style="margin-right: 2rem;">
        Since there is no persistent data, sessions are deleted after both the
        parties exit the room
      </p>
    </div>
    <div class="noInterruptions flex">
      <p style="margin-left: 2rem;">
        Messages are encrypted using asymmetric keys; tamper/intercept proof and
        session is locked once two people join a room
      </p>
      <img src="assets/nointerruptions.svg" alt="no interruptions" />
    </div>
    <div class="sessionDeleted flex modifier">
      <img src="assets/opensource.svg" alt="session deleted" />
      <p style="width: 14rem; margin-bottom: 0; margin-right: 2rem;">
        Source code is open under the MIT license
      </p>
    </div>
  </div>
</section>
