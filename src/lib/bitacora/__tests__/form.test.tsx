import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FormBitacora from "@/components/bitacora/form";

vi.mock("@/hooks/sendData", () => ({ sendDataSupabase: vi.fn() }));
vi.mock("@/lib/data/updateRowBitacora", () => ({ updateDataSupabase: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: () => ({ get: () => undefined }) }));

describe("FormBitacora default date", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("defaults to today (local) at 8:30 PM Zapopan time", () => {
    process.env.TZ = "America/Mexico_City";
    vi.setSystemTime(new Date("2026-06-05T20:30:00"));

    render(
      <FormBitacora
        defaultData={{}}
        toEdit={false}
        setOpen={vi.fn()}
        setDefaultData={vi.fn()}
        open={true}
        handleToEdit={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/Fecha/i) as HTMLInputElement;
    expect(input.value).toBe("2026-06-05");
  });
});
