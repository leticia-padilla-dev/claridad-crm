import { addDays, subDays } from "date-fns";
import { render } from "vitest-browser-react";
import { buildContact, StoryWrapper } from "@/test/StoryWrapper";
import { TodayWeeklyTouchCountersSection } from "./TodayWeeklyTouchCountersSection";

const isoAtNoon = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
    0,
  ).toISOString();

const birthdayForOffset = (daysFromToday: number) => {
  const date = addDays(new Date(), daysFromToday);
  return `${date.getFullYear() - 30}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
};

const createDeal = ({
  id,
  updated_at,
  archived_at = undefined,
}: {
  id: number;
  updated_at: string;
  archived_at?: string;
}) => ({
  amount: 100,
  archived_at,
  category: "General",
  company_id: 1,
  contact_ids: [1],
  created_at: updated_at,
  description: "",
  expected_closing_date: updated_at,
  id,
  index: id,
  name: `Deal ${id}`,
  sales_id: 0,
  stage: "new",
  updated_at,
});

const createCustomerEvent = ({
  id,
  contact_id,
  occurred_at,
}: {
  id: number;
  contact_id: number;
  occurred_at: string;
}) => ({
  contact_id,
  id,
  occurred_at,
  payload: null,
  related_id: null,
  related_table: null,
  sales_id: 0,
  source: "manual" as const,
  type: "note.created" as const,
});

describe("TodayWeeklyTouchCountersSection", () => {
  it("shows the three weekly counters with operational counts", async () => {
    const screen = await render(
      <StoryWrapper
        data={{
          contacts: [
            buildContact({
              id: 1,
              first_name: "Laura",
              last_name: "Perez",
              last_seen: isoAtNoon(subDays(new Date(), 45)),
              birthday: birthdayForOffset(3),
            }),
            buildContact({
              id: 2,
              first_name: "Andrea",
              last_name: "Lema",
              last_seen: isoAtNoon(subDays(new Date(), 2)),
              birthday: birthdayForOffset(10),
            }),
            buildContact({
              id: 3,
              first_name: "Marta",
              last_name: "Ruiz",
              last_seen: isoAtNoon(subDays(new Date(), 12)),
              birthday: birthdayForOffset(0),
            }),
          ],
          customer_events: [
            createCustomerEvent({
              id: 1,
              contact_id: 1,
              occurred_at: isoAtNoon(subDays(new Date(), 40)),
            }),
            createCustomerEvent({
              id: 2,
              contact_id: 2,
              occurred_at: isoAtNoon(subDays(new Date(), 1)),
            }),
          ],
          deals: [
            createDeal({
              id: 1,
              updated_at: isoAtNoon(subDays(new Date(), 10)),
            }),
            createDeal({
              id: 2,
              updated_at: isoAtNoon(subDays(new Date(), 2)),
            }),
            createDeal({
              id: 3,
              updated_at: isoAtNoon(subDays(new Date(), 20)),
              archived_at: isoAtNoon(subDays(new Date(), 1)),
            }),
          ],
        }}
      >
        <TodayWeeklyTouchCountersSection />
      </StoryWrapper>,
    );

    await expect.element(screen.getByText("Toca esta semana")).toBeVisible();
    await expect.element(screen.getByText("Clientas sin contacto")).toBeVisible();
    await expect
      .element(screen.getByText("Oportunidades sin actividad"))
      .toBeVisible();
    await expect.element(screen.getByText("Cumpleanos proximos")).toBeVisible();
    await expect
      .element(screen.getByTestId("weekly-touch-no-contact-count"))
      .toHaveTextContent("1");
    await expect
      .element(screen.getByTestId("weekly-touch-opportunities-count"))
      .toHaveTextContent("1");
    await expect
      .element(screen.getByTestId("weekly-touch-birthdays-count"))
      .toHaveTextContent("1");
    await expect.element(screen.getByRole("link", { name: "Ver clientas" })).toHaveAttribute("href", "/contacts");
    await expect
      .element(screen.getByRole("link", { name: "Ver oportunidades" }))
      .toHaveAttribute("href", "/deals");
    await expect
      .element(screen.getByRole("link", { name: "Ver cumpleanos" }))
      .toHaveAttribute("href", "/contacts");
  });

  it("shows zero counters without collapsing the section", async () => {
    const screen = await render(
      <StoryWrapper
        data={{
          contacts: [
            buildContact({
              id: 1,
              first_name: "Clara",
              last_name: "Diaz",
              last_seen: isoAtNoon(subDays(new Date(), 2)),
              birthday: birthdayForOffset(15),
            }),
          ],
          customer_events: [
            createCustomerEvent({
              id: 1,
              contact_id: 1,
              occurred_at: isoAtNoon(subDays(new Date(), 1)),
            }),
          ],
          deals: [],
        }}
      >
        <TodayWeeklyTouchCountersSection />
      </StoryWrapper>,
    );

    await expect.element(screen.getByText("Toca esta semana")).toBeVisible();
    await expect
      .element(
        screen.getByText(
          "La idea no es abarcarlo todo hoy, sino saber donde conviene volver a mirar esta semana.",
        ),
      )
      .toBeVisible();
  });
});
