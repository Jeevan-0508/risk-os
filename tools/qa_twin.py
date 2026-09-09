"""Focused smoke check for the Program Digital Twin (route /program). Defensive: every
step has a short timeout and is wrapped so one slow step cannot hang the whole run."""
import sys, json
from playwright.sync_api import sync_playwright, TimeoutError as PwTimeout

CHROME = "C:/Users/jeekumak/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe"
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8186"
OUT = sys.argv[2] if len(sys.argv) > 2 else "qa"

errors = []


def step(label, fn):
    try:
        fn()
    except PwTimeout as e:
        print(label, "TIMEOUT", str(e)[:120])
    except Exception as e:  # noqa: BLE001
        print(label, "ERROR", repr(e)[:200])


with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
    page = b.new_page(viewport={"width": 1700, "height": 1100})
    page.set_default_timeout(4000)
    page.on("console", lambda m: errors.append((m.type, m.text)) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(("pageerror", str(e))))

    page.goto(BASE + "/#/program", wait_until="domcontentloaded", timeout=8000)
    print("GOTO_OK")
    page.wait_for_timeout(1200)
    page.screenshot(path=OUT + "/program-initial.png", full_page=True)
    print("SCREENSHOT_OK")

    node_count = page.locator(".react-flow__node").count()
    edge_count = page.locator(".react-flow__edge").count()
    print("INITIAL_NODES", node_count, "EDGES", edge_count)

    def click_workstream():
        btn = page.locator("div.grid > button").first
        if btn.count() > 0:
            btn.click(timeout=3000)
            page.wait_for_timeout(500)
            page.screenshot(path=OUT + "/program-workstream-selected.png", full_page=True)
            print("INFO_PANEL_DIRECT_IMPACT", page.get_by_text("Direct impact", exact=False).count())

    step("WORKSTREAM_CLICK", click_workstream)

    def click_canvas_node():
        nodes = page.locator(".react-flow__node")
        n = nodes.count()
        if n > 0:
            nodes.nth(min(5, n - 1)).click(timeout=3000)
            page.wait_for_timeout(500)
            page.screenshot(path=OUT + "/program-node-selected.png", full_page=True)
            print("AFTER_NODE_CLICK_INFO", page.get_by_text("Direct impact", exact=False).count())

    step("CANVAS_NODE_CLICK", click_canvas_node)

    def toggle_dependency():
        before = page.locator(".react-flow__node").count()
        chip = page.get_by_role("button", name="Dependency", exact=True)
        if chip.count() > 0:
            chip.first.click(timeout=3000)
            page.wait_for_timeout(600)
            after = page.locator(".react-flow__node").count()
            print("TOGGLE_DEPENDENCY_BEFORE", before, "AFTER", after)

    step("TOGGLE_DEPENDENCY", toggle_dependency)

    def click_milestone_row():
        page.goto(BASE + "/#/program", wait_until="domcontentloaded", timeout=8000)
        page.wait_for_timeout(900)
        row = page.locator("table tbody tr").first
        print("MILESTONE_TABLE_ROWS", page.locator("table tbody tr").count())
        if row.count() > 0:
            row.click(timeout=3000)
            page.wait_for_timeout(600)
            page.screenshot(path=OUT + "/program-milestone-selected.png", full_page=True)

    step("MILESTONE_ROW_CLICK", click_milestone_row)

    b.close()

print("CONSOLE_ERRORS", len(errors))
for e in errors[:30]:
    print(json.dumps(e))
print("DONE")
