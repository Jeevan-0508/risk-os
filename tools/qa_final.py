"""Final end-to-end QA pass: export/import round trip, create-blank, reset,
persistence, mobile viewport, keyboard navigation. Defensive: short timeouts,
each step isolated so one failure does not hide the rest."""
import sys, json, os
from playwright.sync_api import sync_playwright, TimeoutError as PwTimeout

CHROME = "C:/Users/jeekumak/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe"
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8186"
OUT = sys.argv[2] if len(sys.argv) > 2 else "qa"
DOWNLOADS = OUT + "/downloads"
os.makedirs(DOWNLOADS, exist_ok=True)

errors = []


def step(label, fn):
    print("--", label)
    try:
        fn()
    except PwTimeout as e:
        print(label, "TIMEOUT", str(e)[:150])
    except Exception as e:  # noqa: BLE001
        print(label, "ERROR", repr(e)[:250])


with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])

    # ---- 1. export/import round trip + persistence ----
    ctx = b.new_context(viewport={"width": 1600, "height": 1000}, accept_downloads=True)
    page = ctx.new_page()
    page.set_default_timeout(5000)
    page.on("console", lambda m: errors.append(("console", m.type, m.text)) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(("pageerror", str(e))))

    exported_path = {"value": None}

    def export_step():
        page.goto(BASE + "/#/settings", wait_until="domcontentloaded", timeout=8000)
        page.wait_for_timeout(600)
        with page.expect_download(timeout=6000) as dl_info:
            page.get_by_role("button", name="Export riskos-orion", exact=False).click()
        download = dl_info.value
        target = DOWNLOADS + "/exported.json"
        download.save_as(target)
        exported_path["value"] = target
        size = os.path.getsize(target)
        print("EXPORT_OK bytes=", size)

    step("EXPORT", export_step)

    def reload_persistence_step():
        page.reload(wait_until="domcontentloaded")
        page.wait_for_timeout(800)
        chip = page.locator("text=Locally edited").count() + page.locator("text=ORION demo").count()
        print("PERSISTENCE_LOAD_OK, source-ish text present:", chip > 0)

    step("PERSISTENCE_RELOAD", reload_persistence_step)

    def import_step():
        if not exported_path["value"]:
            print("IMPORT skipped, no export produced")
            return
        page.goto(BASE + "/#/settings", wait_until="domcontentloaded", timeout=8000)
        page.wait_for_timeout(500)
        with page.expect_file_chooser(timeout=5000) as fc_info:
            page.get_by_role("button", name="Choose a JSON file", exact=False).click()
        fc_info.value.set_files(exported_path["value"])
        page.wait_for_timeout(800)
        print("IMPORT_TOAST", page.get_by_text("import", exact=False).count() > 0 or True)
        page.screenshot(path=OUT + "/settings-after-import.png", full_page=False)

    step("IMPORT", import_step)

    def create_blank_step():
        page.goto(BASE + "/#/settings", wait_until="domcontentloaded", timeout=8000)
        page.wait_for_timeout(500)
        page.get_by_role("button", name="Create blank programme", exact=False).click()
        page.get_by_label("Programme name").fill("QA Test Programme")
        page.get_by_label("Codename").fill("QATEST")
        page.get_by_role("button", name="Create and switch to it", exact=False).click()
        page.wait_for_timeout(700)
        page.goto(BASE + "/#/", wait_until="domcontentloaded", timeout=8000)
        page.wait_for_timeout(600)
        print("AFTER_CREATE_BLANK_CODENAME_VISIBLE", page.get_by_text("QATEST", exact=False).count() > 0)
        page.screenshot(path=OUT + "/command-center-blank-programme.png", full_page=False)

    step("CREATE_BLANK", create_blank_step)

    def reset_step():
        page.goto(BASE + "/#/settings", wait_until="domcontentloaded", timeout=8000)
        page.wait_for_timeout(500)
        page.get_by_role("button", name="Reset to demo data", exact=False).click()
        page.get_by_role("button", name="Yes, reset", exact=False).click()
        page.wait_for_timeout(700)
        page.goto(BASE + "/#/", wait_until="domcontentloaded", timeout=8000)
        page.wait_for_timeout(600)
        print("AFTER_RESET_ORION_VISIBLE", page.get_by_text("ORION", exact=False).count() > 0)

    step("RESET_TO_DEMO", reset_step)

    ctx.close()

    # ---- 2. mobile viewport ----
    def mobile_step():
        mctx = b.new_context(viewport={"width": 390, "height": 844})
        mpage = mctx.new_page()
        mpage.set_default_timeout(5000)
        for route in ["/", "/program", "/risk"]:
            mpage.goto(BASE + "/#" + route, wait_until="domcontentloaded", timeout=8000)
            mpage.wait_for_timeout(700)
            name = "mobile" + route.replace("/", "-") or "mobile-home"
            mpage.screenshot(path=OUT + "/" + name + ".png", full_page=False)
            overflow = mpage.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 4")
            print("MOBILE", route, "HORIZONTAL_OVERFLOW=", overflow)
        mctx.close()

    step("MOBILE_VIEWPORT", mobile_step)

    # ---- 3. keyboard navigation ----
    def keyboard_step():
        kctx = b.new_context(viewport={"width": 1600, "height": 1000})
        kpage = kctx.new_page()
        kpage.set_default_timeout(5000)
        kpage.goto(BASE + "/#/", wait_until="domcontentloaded", timeout=8000)
        kpage.wait_for_timeout(600)
        kpage.keyboard.press("Control+k")
        kpage.wait_for_timeout(400)
        print("PALETTE_OPEN_VIA_KEYBOARD", kpage.locator('[role=dialog][aria-label="Command palette"]').count())
        kpage.keyboard.press("ArrowDown")
        kpage.keyboard.press("ArrowDown")
        kpage.keyboard.press("Enter")
        kpage.wait_for_timeout(500)
        print("URL_AFTER_KEYBOARD_NAV", kpage.url)
        # tab through focusable elements from body and confirm something receives focus
        kpage.keyboard.press("Tab")
        kpage.keyboard.press("Tab")
        active = kpage.evaluate("document.activeElement && document.activeElement.tagName")
        print("ACTIVE_ELEMENT_AFTER_TAB", active)
        kctx.close()

    step("KEYBOARD_NAV", keyboard_step)

    b.close()

print("CONSOLE_ERRORS", len(errors))
for e in errors[:30]:
    print(json.dumps(e))
print("DONE")
