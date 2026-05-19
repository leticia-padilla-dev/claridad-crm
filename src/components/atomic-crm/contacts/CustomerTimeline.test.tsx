import { render } from "vitest-browser-react";
import { buildContact, StoryWrapper } from "@/test/StoryWrapper";
import { CustomerTimeline } from "./CustomerTimeline";

describe("CustomerTimeline", () => {
  it("shows an empty state when the customer has no events", async () => {
    const contact = buildContact({ id: 1 });

    const screen = await render(
      <StoryWrapper data={{ contacts: [contact], customer_events: [] }}>
        <CustomerTimeline contactId={contact.id} />
      </StoryWrapper>,
    );

    await expect
      .element(
        screen.getByText(
          "No hay actividad registrada con esta clienta todavia",
        ),
      )
      .toBeVisible();
  });

  it("renders the supported customer event cards in reverse chronological order", async () => {
    const contact = buildContact({ id: 1 });

    const screen = await render(
      <StoryWrapper
        data={{
          contacts: [contact],
          customer_events: [
            {
              id: 1,
              contact_id: 1,
              occurred_at: "2026-05-19T09:00:00.000Z",
              payload: { preview: "Envio catalogo inicial" },
              source: "system",
              type: "note.created",
            },
            {
              id: 2,
              contact_id: 1,
              occurred_at: "2026-05-19T11:00:00.000Z",
              payload: { title: "Confirmar entrega del pedido" },
              source: "system",
              type: "task.completed",
            },
            {
              id: 3,
              contact_id: 1,
              occurred_at: "2026-05-19T12:00:00.000Z",
              payload: {
                from_stage: "new",
                name: "In Cruises Junio",
                to_stage: "proposal",
              },
              source: "system",
              type: "opportunity.stage_changed",
            },
          ],
        }}
      >
        <CustomerTimeline contactId={contact.id} />
      </StoryWrapper>,
    );

    await expect.element(screen.getByText("Nota creada")).toBeVisible();
    await expect
      .element(screen.getByText("Seguimiento completado"))
      .toBeVisible();
    await expect
      .element(screen.getByText("Cambio de etapa de oportunidad"))
      .toBeVisible();

    await expect
      .poll(() => screen.container.textContent?.trim() ?? "")
      .toContain("In Cruises Junio paso de new a proposal");
  });
});
