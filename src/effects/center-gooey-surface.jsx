import React from "react";
import { createRoot } from "react-dom/client";
import { Liquid } from "liquid-gooey";

function GooeySurface() {
  return (
    <Liquid
      className="center-gooey-group"
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
