import { test, expect } from "@playwright/test";

test.describe("Standings", () => {
  test("navigates to standings from Matches dropdown", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Matches" }).click();
    await page.locator(".dropdown-item", { hasText: "Standings" }).click();

    await expect(page).toHaveURL("/standings");
    await expect(page.locator(".standings-back")).toBeVisible();
  });

  test("Matches dropdown closes after navigating to Matches", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Matches" }).click();
    await page.locator(".dropdown-item", { hasText: "Matches" }).click();

    await expect(page.locator(".dropdown-menu.show")).toHaveCount(0);
  });

  test("Stats dropdown closes after navigating", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Stats" }).click();
    await page.locator(".dropdown-item", { hasText: "Dream teams" }).click();

    await expect(page.locator(".dropdown-menu.show")).toHaveCount(0);
  });
});
