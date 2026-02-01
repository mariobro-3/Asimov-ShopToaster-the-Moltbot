import type { CostUsageSummary } from "../types";

type UsageState = {
  client: { request: <T>(method: string, params?: unknown) => Promise<T> } | null;
  usageLoading: boolean;
  usageSummary: CostUsageSummary | null;
};

export async function loadUsage(state: UsageState, days = 30): Promise<void> {
  if (!state.client) return;
  if (state.usageLoading) return;

  state.usageLoading = true;
  try {
    const summary = await state.client.request<CostUsageSummary>("usage.cost", { days });
    state.usageSummary = summary;
  } catch (err) {
    console.error("[usage] Failed to load usage:", err);
  } finally {
    state.usageLoading = false;
  }
}
