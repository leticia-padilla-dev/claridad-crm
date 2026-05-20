import { test, expect } from "./fixtures";

test("user onboarding", async ({ page, isMobile, menu, dismissToast }) => {
  await page.goto("http://localhost:5175/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Claridad CRM/);
  await expect(page.getByText("Welcome to Claridad CRM")).toBeVisible();

  await page.getByLabel("First name").fill("John");
  await page.getByLabel("Last name").fill("Doe");
  await page.getByLabel("Email").fill("john@doe.com");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/today$/);
  await expect(page.getByText("Inicio operativo")).toBeVisible();

  await menu.goToContacts();
  await page.getByText("New Client").click();
  await page.waitForLoadState("networkidle");
  await page.getByLabel("She/Her").click();
  await page.getByLabel("First name").fill("Jane");
  await page.getByLabel("Last name").fill("Smith");
  await page.getByLabel("Title").fill("CEO");
  await page.getByLabel("Company").click();
  await page
    .getByRole("dialog")
    .last()
    .getByRole("combobox")
    .fill("Smith Corp");
  await page.getByRole("option", { name: "Create Smith Corp" }).click();
  await page
    .getByRole("group", { name: "Email addresses" })
    .getByRole("textbox", { name: "Email" })
    .fill("jane@smithcorp.com");
  await page
    .getByRole("group", { name: "Email addresses" })
    .getByRole("button", { name: "Add" })
    .click();

  await page
    .getByRole("group", { name: "Phone numbers" })
    .getByRole("textbox", { name: "Phone number" })
    .fill("+1234567890");
  await page
    .getByRole("group", { name: "Phone numbers" })
    .getByRole("button", { name: "Add" })
    .click();

  await page
    .getByLabel("LinkedIn URL")
    .fill("https://www.linkedin.com/in/jane-smith");

  await page
    .getByLabel("Background info (bio, how you met, etc)")
    .fill("Met at a conference.");

  await page.getByLabel("Has newsletter").check();

  await expect(page.getByLabel("Account manager *")).toHaveText("John Doe");

  await page.getByRole("button", { name: "Save" }).click();

  await dismissToast("Element created");

  await expect(page.locator(isMobile ? "h2" : "h5")).toHaveText("Jane Smith");
  await expect(page.getByText("CEO at Smith Corp")).toBeVisible();

  await menu.goToDashboard();
  await expect(page.getByText("Inicio operativo")).toBeVisible();
});
