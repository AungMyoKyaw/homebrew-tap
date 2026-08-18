/* =================================================================
 * site.js — shared behavior for the homebrew-tap landing.
 *   copyStatus   — toast announcement helper for any [data-copy-command]
 *   initCopyButtons() — wires every copy button on the page
 *   initTypewriter()  — types out the install command on first paint
 *
 * The Three.js scene (per-page glyph or hero) is loaded separately as
 * a module from each page since each scene is bespoke.
 * ================================================================= */

(function () {
    "use strict";

    // ---- Toast -----------------------------------------------------
    function getStatusEl() {
        return document.getElementById("copy-status");
    }

    let statusTimer = 0;

    function announceStatus(message, state) {
        const status = getStatusEl();
        if (!status) return;
        window.clearTimeout(statusTimer);
        status.textContent = message;
        status.dataset.state = state;
        status.classList.add("is-visible");
        statusTimer = window.setTimeout(() => {
            status.classList.remove("is-visible");
        }, 2400);
    }

    // ---- Clipboard -------------------------------------------------
    async function writeToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        if (typeof document.execCommand !== "function") {
            throw new Error("Clipboard unavailable");
        }

        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        ta.remove();
        if (!ok) throw new Error("Copy command failed");
    }

    // ---- Copy buttons ---------------------------------------------
    function initCopyButtons() {
        const buttons = document.querySelectorAll("[data-copy-command]");
        if (!buttons.length) return;

        buttons.forEach((button) => {
            button.addEventListener("click", async (event) => {
                const originalLabel = button.textContent;
                const command = button.dataset.copyCommand;
                const pkg = event.currentTarget.closest("[data-package]")?.dataset.package;

                button.disabled = true;
                try {
                    await writeToClipboard(command);
                    button.dataset.status = "copied";
                    button.textContent = "Copied";
                    announceStatus(
                        pkg ? "Copied the " + pkg + " install command." : "Copied install command.",
                        "success"
                    );
                } catch (err) {
                    button.dataset.status = "failed";
                    button.textContent = "Try again";
                    announceStatus("Copy failed. Select the command and copy it manually.", "error");
                } finally {
                    window.setTimeout(() => {
                        button.disabled = false;
                        button.textContent = originalLabel;
                        delete button.dataset.status;
                    }, 2200);
                }
            });
        });
    }

    // ---- Typewriter ------------------------------------------------
    function initTypewriter() {
        const target = document.querySelector("[data-typewriter]");
        if (!target) return;

        const fullText = target.textContent;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reducedMotion) {
            // Leave the text in place.
            return;
        }

        target.textContent = "";

        let i = 0;
        const tick = () => {
            if (i <= fullText.length) {
                target.textContent = fullText.slice(0, i);
                i += 1;
                window.setTimeout(tick, 28 + Math.random() * 35);
            }
        };
        window.setTimeout(tick, 350);
    }

    // ---- Boot ------------------------------------------------------
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            initCopyButtons();
            initTypewriter();
        });
    } else {
        initCopyButtons();
        initTypewriter();
    }

    // Expose for page-specific extensions (e.g. count-driven labels
    // on the index). Keeping these on a single namespace avoids
    // polluting the global scope with multiple identifiers.
    window.tapSite = {
        announceStatus,
        writeToClipboard,
    };
})();