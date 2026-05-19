import { render } from "vitest-browser-react";
import { buildContact, StoryWrapper } from "@/test/StoryWrapper";
import { TodayAppointmentsSection } from "./TodayAppointmentsSection";

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = `${today.getMonth() + 1}`.padStart(2, "0");
const currentDay = `${today.getDate()}`.padStart(2, "0");
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const todayAt = (hour: number, minute: number) =>
  `${currentYear}-${currentMonth}-${currentDay}T${`${hour}`.padStart(2, "0")}:${`${minute}`.padStart(2, "0")}:00.000Z`;

const tomorrowAt = (hour: number, minute: number) =>
  `${tomorrow.getFullYear()}-${`${tomorrow.getMonth() + 1}`.padStart(2, "0")}-${`${tomorrow.getDate()}`.padStart(2, "0")}T${`${hour}`.padStart(2, "0")}:${`${minute}`.padStart(2, "0")}:00.000Z`;

const createAppointment = ({
  id,
  contact_id,
  scheduled_at,
  status = "pending",
  type = "consultation",
  notes = null,
}: {
  id: number;
  contact_id: number;
  scheduled_at: string;
  status?: string;
  type?: string;
  notes?: string | null;
}) => ({
  id,
  contact_id,
  created_at: scheduled_at,
  notes,
  sales_id: 0,
  scheduled_at,
  status,
  type,
  updated_at: scheduled_at,
});

describe("TodayAppointmentsSection", () => {
  it("shows a positive empty state when there are no appointments today", async () => {
    const screen = await render(
      <StoryWrapper data={{ appointments: [], contacts: [] }}>
        <TodayAppointmentsSection />
      </StoryWrapper>,
    );

    await expect
      .element(screen.getByText("No tienes citas hoy."))
      .toBeVisible();
    await expect
      .element(
        screen.getByText("Tu agenda queda libre para seguimientos y mensajes."),
      )
      .toBeVisible();
  });

  it("shows only today's pending and confirmed appointments in chronological order", async () => {
    const screen = await render(
      <StoryWrapper
        data={{
          contacts: [
            buildContact({
              id: 1,
              first_name: "Andrea",
              last_name: "Lema",
              business_lines_interest: ["incruises"],
            }),
            buildContact({
              id: 2,
              first_name: "Laura",
              last_name: "Perez",
              business_lines_interest: ["mary-kay"],
            }),
            buildContact({
              id: 3,
              first_name: "Marta",
              last_name: "Ruiz",
            }),
          ],
          appointments: [
            createAppointment({
              id: 1,
              contact_id: 1,
              scheduled_at: todayAt(16, 0),
              status: "confirmed",
              type: "video_call",
              notes: "Videollamada de seguimiento",
            }),
            createAppointment({
              id: 2,
              contact_id: 2,
              scheduled_at: todayAt(10, 30),
              status: "pending",
              type: "delivery",
            }),
            createAppointment({
              id: 3,
              contact_id: 3,
              scheduled_at: tomorrowAt(9, 0),
              status: "pending",
              type: "consultation",
            }),
            createAppointment({
              id: 4,
              contact_id: 1,
              scheduled_at: todayAt(18, 0),
              status: "cancelled",
              type: "video_call",
            }),
          ],
        }}
      >
        <TodayAppointmentsSection />
      </StoryWrapper>,
    );

    await expect
      .element(screen.getByText("Citas de hoy (2)"))
      .toBeVisible();
    await expect.element(screen.getByText("Laura Perez")).toBeVisible();
    await expect.element(screen.getByText("Andrea Lema")).toBeVisible();
    await expect.element(screen.getByText("Entrega")).toBeVisible();
    await expect.element(screen.getByText(/^Videollamada$/)).toBeVisible();
    await expect.element(screen.getByText(/^Confirmada$/)).toBeVisible();
    await expect
      .poll(
        () => screen.container.textContent?.includes("Marta Ruiz") ?? false,
      )
      .toBe(false);

    const lauraIndex = screen.container.textContent?.indexOf("Laura Perez") ?? -1;
    const andreaIndex =
      screen.container.textContent?.indexOf("Andrea Lema") ?? -1;

    expect(lauraIndex).toBeGreaterThanOrEqual(0);
    expect(andreaIndex).toBeGreaterThan(lauraIndex);
  });

  it("links each appointment to the contact profile", async () => {
    const screen = await render(
      <StoryWrapper
        data={{
          contacts: [
            buildContact({
              id: 7,
              first_name: "Paula",
              last_name: "Mora",
            }),
          ],
          appointments: [
            createAppointment({
              id: 1,
              contact_id: 7,
              scheduled_at: todayAt(12, 15),
              status: "pending",
              type: "consultation",
            }),
          ],
        }}
      >
        <TodayAppointmentsSection />
      </StoryWrapper>,
    );

    await expect
      .element(screen.getByRole("link", { name: "Abrir ficha" }))
      .toHaveAttribute("href", "/contacts/7/show");
  });
});
