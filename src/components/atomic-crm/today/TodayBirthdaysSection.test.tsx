import { useDataProvider, type DataProvider } from "ra-core";
import { render } from "vitest-browser-react";
import { vi } from "vitest";
import { buildContact, StoryWrapper } from "@/test/StoryWrapper";
import { TodayBirthdaysSection } from "./TodayBirthdaysSection";

const today = new Date();
const currentYear = today.getFullYear();
const todayBirthday = `${currentYear - 30}-${`${today.getMonth() + 1}`.padStart(2, "0")}-${`${today.getDate()}`.padStart(2, "0")}`;
const anotherBirthday = `${currentYear - 28}-12-24`;

describe("TodayBirthdaysSection", () => {
  it("shows a positive empty state when there are no birthdays today", async () => {
    const screen = await render(
      <StoryWrapper
        data={{
          contacts: [
            buildContact({
              id: 1,
              birthday: anotherBirthday,
            }),
          ],
        }}
      >
        <TodayBirthdaysSection />
      </StoryWrapper>,
    );

    await expect.element(screen.getByText("Nadie cumple hoy.")).toBeVisible();
    await expect
      .element(
        screen.getByText("Puedes dedicar el dia a seguimientos y citas."),
      )
      .toBeVisible();
  });

  it("shows only contacts whose birthday is today", async () => {
    const screen = await render(
      <StoryWrapper
        data={{
          contacts: [
            buildContact({
              id: 1,
              first_name: "Laura",
              last_name: "Martin",
              birthday: todayBirthday,
              whatsapp: "+34 611 11 11 11",
            }),
            buildContact({
              id: 2,
              first_name: "Sofia",
              last_name: "Lopez",
              birthday: anotherBirthday,
            }),
          ],
        }}
      >
        <TodayBirthdaysSection />
      </StoryWrapper>,
    );

    await expect.element(screen.getByText("Cumpleanos hoy (1)")).toBeVisible();
    await expect.element(screen.getByText("Laura Martin")).toBeVisible();
    await expect
      .poll(
        () => screen.container.textContent?.includes("Sofia Lopez") ?? false,
      )
      .toBe(false);
    await expect
      .element(screen.getByRole("button", { name: "Felicitar por WhatsApp" }))
      .toBeVisible();
  });

  it("opens WhatsApp with the birthday greeting and records the event", async () => {
    let dataProvider: DataProvider | null = null;
    const windowOpenSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null as any);

    const DataProviderListener = () => {
      dataProvider = useDataProvider();
      return null;
    };

    const screen = await render(
      <StoryWrapper
        data={{
          contacts: [
            buildContact({
              id: 1,
              first_name: "Laura",
              last_name: "Martin",
              birthday: todayBirthday,
              business_lines_interest: ["mary-kay"],
              whatsapp: "+34 611 11 11 11",
            }),
          ],
        }}
      >
        <DataProviderListener />
        <TodayBirthdaysSection />
      </StoryWrapper>,
    );

    await screen
      .getByRole("button", { name: "Felicitar por WhatsApp" })
      .click();

    await expect
      .poll(async () => {
        const { data } = await dataProvider!.getList("customer_events", {
          filter: { type: "whatsapp.opened" },
          pagination: { page: 1, perPage: 10 },
          sort: { field: "id", order: "DESC" },
        });

        return data[0]?.payload;
      })
      .toMatchObject({
        mode: "birthday",
        phone_number: "+34 611 11 11 11",
      });

    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://wa.me/34611111111?text=Hola%20Laura%2C%20feliz%20cumpleanos.",
      ),
      "_blank",
      "noopener,noreferrer",
    );

    windowOpenSpy.mockRestore();
  });
});
