import sys
from playwright.sync_api import sync_playwright

CHROME = "C:/Users/jeekumak/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe"
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8192"
OUT = sys.argv[2] if len(sys.argv) > 2 else "qa"

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
    page = b.new_page(viewport={"width": 1760, "height": 1000})
    page.set_default_timeout(4000)
    page.goto(BASE + "/#/program", wait_until="domcontentloaded", timeout=8000)
    page.wait_for_timeout(1200)
    heading = page.get_by_text("Program Digital Twin", exact=False).first
    heading.scroll_into_view_if_needed()
    page.wait_for_timeout(600)
    page.screenshot(path=OUT + "/program-twin-panel.png")

    nodes = page.locator(".react-flow__node")
    nodes.nth(3).click(timeout=3000)
    page.wait_for_timeout(600)
    page.screenshot(path=OUT + "/program-twin-panel-selected.png")
    b.close()
print("DONE")
