import { useDataProvider, type DataProvider, type Identifier } from "ra-core";
import { render } from "vitest-browser-react";
import { buildContact, StoryWrapper } from "@/test/StoryWrapper";
import { TodayOverdueTasksSection } from "./TodayOverdueTasksSection";

const salesId = 0;

const createTask = ({
  id,
  contact_id,
  dueDate,
  text,
  done_date = null,
}: {
  id: Identifier;
  contact_id: Identifier;
  dueDate: string;
  text: string;
  done_date?: string | null;
}) => ({
  id,
  contact_id,
  due_date: dueDate,
  done_date,
  sales_id: salesId,
  text,
  type: "Call",
});

describe("TodayOverdueTasksSection", () => {
  it("shows a positive empty state when there are no overdue tasks", async () => {
    const screen = await render(
      <StoryWrapper data={{ contacts: [], tasks: [] }}>
        <TodayOverdueTasksSection />
      </StoryWrapper>,
    );

    await expect
      .element(screen.getByText("No hay seguimientos pendientes."))
      .toBeVisible();
    await expect.element(screen.getByText("Buen trabajo.")).toBeVisible();
  });

  it("shows only the first five overdue tasks and a view-all CTA", async () => {
    const contacts = Array.from({ length: 6 }, (_, index) =>
      buildContact({
        id: index + 1,
        first_name: `Client ${index + 1}`,
        last_name: "Test",
        sales_id: salesId,
      }),
    );

    const tasks = [
      createTask({
        id: 1,
        contact_id: 1,
        dueDate: "2026-05-10T09:00:00.000Z",
        text: "Task oldest",
      }),
      createTask({
        id: 2,
        contact_id: 2,
        dueDate: "2026-05-11T09:00:00.000Z",
        text: "Task older",
      }),
      createTask({
        id: 3,
        contact_id: 3,
        dueDate: "2026-05-12T09:00:00.000Z",
        text: "Task old",
      }),
      createTask({
        id: 4,
        contact_id: 4,
        dueDate: "2026-05-13T09:00:00.000Z",
        text: "Task mid",
      }),
      createTask({
        id: 5,
        contact_id: 5,
        dueDate: "2026-05-14T09:00:00.000Z",
        text: "Task recent",
      }),
      createTask({
        id: 6,
        contact_id: 6,
        dueDate: "2026-05-15T09:00:00.000Z",
        text: "Task hidden",
      }),
    ];

    const screen = await render(
      <StoryWrapper data={{ contacts, tasks }}>
        <TodayOverdueTasksSection />
      </StoryWrapper>,
    );

    await expect
      .element(screen.getByText("Seguimientos vencidos (6)"))
      .toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "Ver todos (6)" }))
      .toBeVisible();

    await expect
      .poll(() => screen.container.textContent)
      .toContain("Task oldest");
    await expect
      .poll(() => screen.container.textContent)
      .toContain("Task recent");
    await expect
      .poll(
        () => screen.container.textContent?.includes("Task hidden") ?? false,
      )
      .toBe(false);
  });

  it("marks an overdue task as done", async () => {
    let dataProvider: DataProvider | null = null;

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
              first_name: "Jane",
              last_name: "Smith",
              sales_id: salesId,
            }),
          ],
          tasks: [
            createTask({
              id: 1,
              contact_id: 1,
              dueDate: "2026-05-10T09:00:00.000Z",
              text: "Follow up with Jane",
            }),
          ],
        }}
      >
        <DataProviderListener />
        <TodayOverdueTasksSection />
      </StoryWrapper>,
    );

    await expect.element(screen.getByText("Follow up with Jane")).toBeVisible();

    await screen.getByRole("button", { name: "Hecho" }).click();

    await expect
      .poll(async () => {
        const { data } = await dataProvider!.getOne("tasks", { id: 1 });
        return data.done_date != null;
      })
      .toBe(true);

    await expect
      .element(screen.getByText("No hay seguimientos pendientes."))
      .toBeVisible();
  });
});
