<script lang="ts">
  interface Props {
    startDate: string;
    endDate: string;
  }
  let { startDate, endDate }: Props = $props();

  let now = $state(Date.now());
  const today = $derived(toDateOnly(new Date(now)));
  let status = $derived(computeStatus(startDate, endDate, today));
  let daysUntilOpen = $derived(computeDaysUntil(startDate, today));

  function toDateOnly(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function parseDate(isoDate: string): Date {
    return new Date(isoDate + "T00:00:00");
  }

  function computeStatus(
    start: string,
    end: string,
    now: Date
  ): "open" | "upcoming" | "closed" {
    const startD = toDateOnly(parseDate(start));
    const endD = toDateOnly(parseDate(end));
    if (now < startD) return "upcoming";
    if (now > endD) return "closed";
    return "open";
  }

  function computeDaysUntil(start: string, now: Date): number {
    const startD = toDateOnly(parseDate(start));
    const diff = startD.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  }

  $effect(() => {
    const interval = setInterval(() => {
      now = Date.now();
    }, 60_000);
    return () => clearInterval(interval);
  });
</script>

{#if status === "open"}
  <span
    class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide bg-emerald-500/90 text-white shadow"
    >Open Now</span
  >
{:else if status === "upcoming"}
  <span
    class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-900 shadow"
  >
    Opens in {daysUntilOpen} {daysUntilOpen === 1 ? "day" : "days"}
  </span>
{:else}
  <span
    class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide bg-zinc-600/90 text-zinc-200 shadow"
    >Now closed</span
  >
{/if}
