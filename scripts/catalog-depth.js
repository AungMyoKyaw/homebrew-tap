/* ============================================================
 * catalog-depth.js — scroll-driven depth on the brew-tap catalog.
 *
 * Two complementary effects, both designed to layer cleanly on top
 * of the static page rather than overwhelm it:
 *
 *   1. Reveal on scroll
 *      Each .package-row starts slightly translated and faded.
 *      An IntersectionObserver triggers a CSS transition that
 *      settles them into place as they enter the viewport.
 *
 *   2. Pointer-driven parallax
 *      The whole catalog section tilts a few degrees in response
 *      to mouse position — very subtle (max 1.5deg) so it reads
 *      as depth, not as motion sickness.
 *
 *   3. Row hover-glow
 *      Hovering a package row triggers a soft per-row glow
 *      driven by --orange or --green depending on data-kind.
 *
 * Honours prefers-reduced-motion by short-circuiting observers
 * and CSS transitions.
 * ============================================================ */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initCatalogDepth() {
    const rows = document.querySelectorAll('.package-row');
    if (!rows.length) return;

    if (REDUCED_MOTION) {
        // Just leave them in their natural position — no observers needed.
        return;
    }

    // ---- 1. Reveal on scroll -----------------------------------------
    rows.forEach((row) => {
        row.classList.add('depth-pending');
    });

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('depth-in');
                    io.unobserve(entry.target);
                }
            }
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

        rows.forEach((row) => io.observe(row));
    } else {
        // Fallback — just show everything.
        rows.forEach((row) => row.classList.add('depth-in'));
    }

    // ---- 2. Pointer-driven parallax on the catalog section ----------
    const sections = document.querySelectorAll('.catalog-section');
    if (sections.length) {
        const onMove = (e) => {
            const nx = (e.clientX / window.innerWidth) - 0.5;
            const ny = (e.clientY / window.innerHeight) - 0.5;
            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const visible = rect.bottom > 0 && rect.top < window.innerHeight;
                if (!visible) return;
                section.style.setProperty('--tilt-x', `${(-ny * 1.4).toFixed(3)}deg`);
                section.style.setProperty('--tilt-y', `${(nx * 1.0).toFixed(3)}deg`);
            });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
    }

    // ---- 3. Row hover-glow ------------------------------------------
    rows.forEach((row) => {
        row.addEventListener('pointerenter', () => row.classList.add('row-hover'));
        row.addEventListener('pointerleave', () => row.classList.remove('row-hover'));
    });
}