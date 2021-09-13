<script>
  import Layout from './lib/Layout.svelte';
  let isActive = false;
</script>

<Layout>
  <section
    class="mt-4 md:mt-10 space-y-4 w-full flex flex-col items-center {isActive
      ? 'px-6 py-4 flex-1 bg-[#171b22] border border-[#30363d] rounded-md'
      : ''}"
  >
    {#if !isActive}
      <form class="w-full rounded-md p-4 bg-[#171b22] border border-[#30363d]">
        <input
          type="text"
          name="room-code"
          class="bg-[#0d1117] h-12 text-center focus:outline-none w-full rounded-md"
        />
        <button type="submit" class="h-12 flex items-center justify-center w-full mt-4"
          >Enter with secret code</button
        >
      </form>
      <span class="text-[#8b949e] text-sm">or</span>
      <button
        on:click={() => (isActive = true)}
        class="rounded-md h-12 flex items-center justify-center w-full bg-[#6875f5]"
        >Start a new chat</button
      >
    {:else}
      <div class="flex-1 space-y-4 flex flex-col w-full">
        <header class="w-full h-10 flex items-center justify-between">
          <div
            class="border border-[#30363d] rounded-md h-full inline-flex items-center justify-center px-4"
          >
            <span>72826</span>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
          <div class="text-sm">
            <span class="active inline-flex items-center">Chat Locked</span>
            <span class="active inline-flex items-center ml-8">Network</span>
          </div>
        </header>
        <main class="flex-1 w-full bg-[#0d1117] p-4 space-y-4">
          <div class="inline-flex items-center">
            <span class="w-10 h-10 bg-yellow-100 rounded-full">
              <img src="https://avatars.dicebear.com/api/croodles-neutral/test.svg" />
            </span>
            <span
              class="inline-flex items-center px-4 h-10 rounded-r-full rounded-t-full bg-[#171b22] ml-2"
              >hey, whats up?</span
            >
          </div>
          <div class="flex flex-row-reverse items-center ml-auto">
            <span class="w-10 h-10 bg-yellow-100 rounded-full">
              <img src="https://avatars.dicebear.com/api/croodles-neutral/test.svg" />
            </span>
            <span
              class="inline-flex items-center px-4 h-10 rounded-l-full rounded-t-full bg-[#6875f5] mr-2"
              >hey, whats up?</span
            >
          </div>
        </main>
        <footer class="w-full">
          <form class="flex h-12">
            <input
              type="text"
              name="message"
              placeholder="Type your message here"
              class="bg-[#0d1117] text-left px-4 focus:outline-none w-full rounded-md"
            />
            <button
              type="submit"
              class="ml-2 h-full inline-flex items-center justify-center w-32 -ml-2 rounded-md bg-[#171b22] border-8 border-[#0d1117] rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mr-2 h-3.5 transform rotate-90"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                />
              </svg>
              <span>Send</span>
            </button>
          </form>
          <div class="mt-4 text-[#8b949e] text-xs flex items-center">
            <p>type '/' for chat options</p>
            <p class="ml-4">open console for your public key</p>
          </div>
        </footer>
      </div>
    {/if}
  </section>

  {#if isActive}
    <p class="text-xs mt-4 text-center">Please do not share personal information without anyone.</p>
  {/if}
</Layout>

<style>
  .active::before {
    position: absolute;
    content: '';
    width: 8px;
    height: 8px;
    background: yellow;
    margin-left: -14px;
    margin-top: 2px;
    border-radius: 50%;
  }
</style>
