import React, { useId, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Liquid } from "liquid-gooey";

function GooeySurface() {
  const group = useRef(null);
  const [silhouetteId, setSilhouetteId] = useState(null);
  const maskId = `center-frosted-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  useLayoutEffect(() => {
    setSilhouetteId(group.current?.querySelector('[data-gooey-svg] > g[id]')?.id || null);
  }, []);
  return (
    <>
    <svg className="center-glass-mask-defs" width="0" height="0" aria-hidden="true">
      <defs>
        {/* Explicit bounds include the 240px overscan around the 360×380 host. */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="840" height="860" style={{ maskType: "alpha" }}>
          {silhouetteId && <use href={`#${silhouetteId}`} transform="translate(240 240)" />}
        </mask>
      </defs>
    </svg>
    {/* Tint and blur are applied once to the unified shape, not to its children. */}
    <div className="center-nav-frosted-surface" hidden={!silhouetteId}
      style={{ maskImage: `url(#${maskId})`, WebkitMaskImage: `url(#${maskId})` }} />
    <Liquid
      ref={group}
      className={`center-gooey-group${silhouetteId ? " center-gooey-group--glass-mask" : ""}`}
      blur={6}
      contrast={18}
      fill="#fff"
      filterPadding={240}
    >
      <Liquid.Item className="center-gooey-base-item" radius={50}>
        <div className="center-gooey-base-surface" />
      </Liquid.Item>
      <Liquid.Item observe>
        <div className="center-gooey-menu-panel-surface" />
      </Liquid.Item>
    </Liquid>
    </>
  );
}

export function mountCenterGooeySurface(shell) {
  const host = document.createElement("div");
  host.className = "center-gooey-host";
  host.setAttribute("aria-hidden", "true");
  shell.prepend(host);
  const root = createRoot(host);
  root.render(<GooeySurface />);
  return {
    getPanel() {
      return host.querySelector(".center-gooey-menu-panel-surface");
    },
    destroy() {
      root.unmount();
      host.remove();
    },
  };
}
