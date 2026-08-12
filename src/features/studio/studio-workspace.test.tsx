import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { StudioWorkspace } from "./studio-workspace";
import { demoVoices } from "@/features/voices/demo-voices";

describe("StudioWorkspace", () => {
  it("counts Arabic characters as the user writes", async () => {
    const user = userEvent.setup();
    render(<StudioWorkspace voices={demoVoices} />);
    await user.type(screen.getByLabelText("النص العربي"), "مباراة اليوم");
    expect(screen.getByText("12 / 5000 حرف")).toBeInTheDocument();
  });

  it("asks for the improvement scope before changing anything", async () => {
    const user = userEvent.setup();
    render(<StudioWorkspace voices={demoVoices} />);
    await user.click(screen.getByRole("button", { name: "تحسين تلقائي" }));
    expect(screen.getByRole("heading", { name: "ماذا تريد أن نحسّن؟" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "إعدادات الصوت فقط" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "النص وإعدادات الصوت" })).toBeInTheDocument();
  });
});
