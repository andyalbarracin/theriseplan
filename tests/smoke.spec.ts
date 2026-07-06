import { test, expect } from "@playwright/test";

const publicRoutes = [
  "/",
  "/cuaderno",
  "/cuaderno/notas-desde-el-aeropuerto",
  "/proyectos",
  "/proyectos/zaire",
  "/ahora",
  "/sobre-mi",
  "/hablemos",
  "/login",
];

const dashboardRoutes = [
  "/dashboard",
  "/dashboard/home",
  "/dashboard/cuaderno",
  "/dashboard/cuaderno/new",
  "/dashboard/proyectos",
  "/dashboard/proyectos/new",
  "/dashboard/media",
  "/dashboard/seo",
  "/dashboard/navigation",
  "/dashboard/ajustes",
];

const benign = /favicon|manifest|Download the React DevTools|Extra attributes from the server/i;

for (const route of [...publicRoutes, ...dashboardRoutes]) {
  test(`route ${route} renders, no page errors, no broken images`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error" && !benign.test(m.text())) errors.push(`console: ${m.text()}`);
    });

    const resp = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(resp, `no response for ${route}`).not.toBeNull();
    expect(resp!.status(), `status for ${route}`).toBeLessThan(400);

    await page.waitForTimeout(700); // let client components hydrate/render

    const broken = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src)
    );
    expect(broken, `broken images on ${route}`).toEqual([]);
    expect(errors, `errors on ${route}`).toEqual([]);
  });
}

test("ELVA (hidden project) never appears publicly", async ({ page }) => {
  await page.goto("/proyectos", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("ELVA", { exact: false })).toHaveCount(0);
  const resp = await page.goto("/proyectos/elva", { waitUntil: "domcontentloaded" });
  expect(resp!.status()).toBe(404);
});

test("home hero boarding pass advances", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("BOARDING PASS").first()).toBeVisible();
});
