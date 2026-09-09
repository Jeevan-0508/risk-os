"""Browser smoke check. Loads the built app, walks every route, records console errors."""
import sys, json
from playwright.sync_api import sync_playwright

CHROME = "C:/Users/jeekumak/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe"
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8182"
ROUTES = ["/", "/program", "/raid", "/risk", "/fmea", "/root-cause", "/dependencies",
          "/change", "/decisions", "/benefits", "/simulation", "/brief", "/settings"]
OUT = sys.argv[2] if len(sys.argv) > 2 else "qa"

errors = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
    page = b.new_page(viewport={"width": 1600, "height": 1000})
    page.on("console", lambda m: errors.append((page.url, m.type, m.text)) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append((page.url, "pageerror", str(e))))
    for r in ROUTES:
        page.goto(BASE + "/#" + r, wait_until="load")
        page.wait_for_timeout(900)
        name = r.strip("/").replace("/", "-") or "command-center"
        page.screenshot(path=OUT + "/" + name + ".png", full_page=True)
        heads = page.locator("h1").all_inner_texts()
        print("ROUTE", r, "h1=", heads)
    # command palette
    page.goto(BASE + "/#/", wait_until="load")
    page.wait_for_timeout(500)
    page.keyboard.press("Control+k")
    page.wait_for_timeout(400)
    print("PALETTE_OPEN", page.locator('[role=dialog][aria-label="Command palette"]').count())
    page.keyboard.type("vendor")
    page.wait_for_timeout(400)
    page.screenshot(path=OUT + "/palette.png")
    print("PALETTE_RESULTS", page.locator('[role=dialog] li button').count())
    page.keyboard.press("Escape")
    page.wait_for_timeout(200)
    # KPI drill-down
    page.locator('button[aria-label^="Residual risk exposure"]').first.click()
    page.wait_for_timeout(500)
    print("DRAWER", page.locator('[aria-modal="true"]').count())
    page.screenshot(path=OUT + "/kpi-drawer.png")
    b.close()

print("CONSOLE_ERRORS", len(errors))
for e in errors[:20]:
    print(json.dumps(e))
