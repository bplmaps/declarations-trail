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
            <path fill="currentColor" fill-rule="evenodd" d="m20.83 10.715l-.518 1.932c-.605 2.255-.907 3.383-1.592 4.114a4 4 0 0 1-2.01 1.161c-.097.023-.195.04-.295.052c-.915.113-2.032-.186-4.064-.73c-2.255-.605-3.383-.907-4.114-1.592a4 4 0 0 1-1.161-2.011c-.228-.976.074-2.103.679-4.358l.517-1.932l.244-.905c.455-1.666.761-2.583 1.348-3.21a4 4 0 0 1 2.01-1.16c.976-.228 2.104.074 4.36.679c2.254.604 3.382.906 4.113 1.59a4 4 0 0 1 1.161 2.012c.228.976-.075 2.103-.679 4.358m-9.778-.91a.75.75 0 0 1 .919-.53l4.83 1.295a.75.75 0 1 1-.389 1.448l-4.83-1.294a.75.75 0 0 1-.53-.918m-.776 2.898a.75.75 0 0 1 .918-.53l2.898.777a.75.75 0 1 1-.388 1.448l-2.898-.776a.75.75 0 0 1-.53-.919" clip-rule="evenodd" />
            <path fill="currentColor" d="M16.415 17.975a4 4 0 0 1-1.068 1.677c-.731.685-1.859.987-4.114 1.591s-3.383.907-4.358.679a4 4 0 0 1-2.011-1.161c-.685-.731-.988-1.859-1.592-4.114l-.517-1.932c-.605-2.255-.907-3.383-.68-4.358a4 4 0 0 1 1.162-2.011c.731-.685 1.859-.987 4.114-1.592c.426-.114.813-.218 1.165-.309l-.244.906l-.517 1.932c-.605 2.255-.907 3.382-.68 4.358a4 4 0 0 0 1.162 2.011c.731.685 1.859.987 4.114 1.592c2.032.544 3.149.843 4.064.73" opacity=".5" />
          </svg>
          Events
        </a>

        <a
          href="/about"
          class="mobile-link w-fit flex items-center justify-center gap-3 text-lg sm:text-2xl text-zinc-100 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden>
            <title>Info Icon</title>
            <path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.6.376 3.112 1.043 4.453c.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.592l2.226-.596a1.634 1.634 0 0 1 1.149.133A9.958 9.958 0 0 0 12 22" opacity=".5" />
            <path fill="currentColor" d="M7.5 11.11c0 1.368 1.319 2.804 2.529 3.833c.823.7 1.235 1.05 1.971 1.05s1.148-.35 1.971-1.05c1.21-1.03 2.529-2.465 2.529-3.834c0-2.677-2.475-3.676-4.5-1.608c-2.025-2.068-4.5-1.069-4.5 1.608" />
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
