<script lang="ts">
  let isOpen = $state(false);

  function toggle() {
    isOpen = !isOpen;
  }

  function close() {
    isOpen = false;
  }
</script>

<div class="flex items-center justify-center gap-12">
  {#if isOpen}
    <!-- Desktop nav: slot content -->
    <div
      class="nav-desktop hidden lg:flex gap-4"
      style="animation: navFadeIn 0.5s ease-in-out"
    >
      <slot />
    </div>

    <!-- Mobile dialog overlay -->
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      class="lg:hidden absolute z-50 w-full h-full flex flex-col gap-4 top-0 bg-zinc-900/20 backdrop-blur-md nav-overlay"
      style="animation: navFadeIn 0.25s ease-in-out"
      onclick={close}
    >
      <div
        class="fixed bottom-20 sm:bottom-32 left-4 sm:left-8 flex flex-col items-start justify-center gap-4"
        onclick={(e) => e.stopPropagation()}
      >
        <a
          href="/events"
          class="mobile-link w-fit flex items-center justify-center gap-3 text-lg sm:text-2xl text-zinc-100 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden>
            <title>Events icon</title>
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5" />
            <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>
          Events
        </a>

        <a
          href="/about"
          class="mobile-link w-fit flex items-center justify-center gap-3 text-lg sm:text-2xl text-zinc-100 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden>
            <title>About icon</title>
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5" />
            <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>
          About
        </a>


        <button
          type="button"
          onclick={close}
          class="w-fit flex items-center justify-center gap-3 text-lg sm:text-2xl text-zinc-100 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden>
            <title>Close Icon</title>
            <path fill="currentColor" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity=".5" />
            <path fill="currentColor" d="M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 1 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 0 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06" />
          </svg>
          Close
        </button>
      </div>
    </div>
  {/if}

  <button
    type="button"
    onclick={toggle}
    class="w-6 sm:w-8 h-fit text-white cursor-pointer hover:outline-2 focus-visible:outline-2 outline-offset-1 outline-zinc-100/20 focus-visible:outline-white rounded-lg"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      class="transition-all duration-300 ease-in-out {isOpen ? 'rotate-90' : 'rotate-0'}"
    >
      <title>Menu Icon</title>
      <path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10" opacity=".5" />
      <path fill="currentColor" d="M13.024 14.56c.493-.197.739-.296.932-.465c.05-.043.096-.09.139-.139c.17-.193.268-.44.465-.932c.924-2.31 1.386-3.465.938-4.124a1.5 1.5 0 0 0-.398-.398c-.66-.448-1.814.014-4.124.938c-.493.197-.74.295-.933.465c-.049.043-.095.09-.138.139c-.17.193-.268.44-.465.932c-.924 2.31-1.386 3.464-.938 4.124a1.5 1.5 0 0 0 .398.398c.66.448 1.814-.014 4.124-.938" />
    </svg>
  </button>
</div>

<style>
  @keyframes navFadeIn {
    from {
      filter: blur(20px);
      opacity: 0;
    }
    to {
      filter: blur(0);
      opacity: 1;
    }
  }
</style>
