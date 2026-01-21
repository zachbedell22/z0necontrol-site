const hotspots = document.querySelectorAll(".diagram-hotspot");
const callouts = document.querySelectorAll(".callout");

const clearActive = () => {
  callouts.forEach((callout) => callout.classList.remove("active"));
  hotspots.forEach((hotspot) => hotspot.setAttribute("aria-expanded", "false"));
};

const activateTarget = (hotspot) => {
  const targetId = hotspot.dataset.target;
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }
  clearActive();
  target.classList.add("active");
  hotspot.setAttribute("aria-expanded", "true");
};

hotspots.forEach((hotspot) => {
  hotspot.setAttribute("aria-expanded", "false");
  hotspot.addEventListener("click", () => {
    const targetId = hotspot.dataset.target;
    const target = document.getElementById(targetId);
    const isActive = target?.classList.contains("active");
    if (isActive) {
      clearActive();
      return;
    }
    activateTarget(hotspot);
    target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  hotspot.addEventListener("mouseenter", () => activateTarget(hotspot));
  hotspot.addEventListener("focus", () => activateTarget(hotspot));
});

const form = document.getElementById("betaForm");

const buildMailtoLink = (payload) => {
  const subject = "Z0neControl — Beta access request";
  const recipient = ["zach", "bedell22", "gmail", "com"];
  const address = `${recipient[0]}${recipient[1]}@${recipient[2]}.${recipient[3]}`;
  const bodyLines = [
    "Hello Z0neControl team,",
    "",
    "I would like to request beta access.",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Company: ${payload.company || ""}`,
    `Control focus: ${payload.control || ""}`,
    "",
    "Thanks."
  ];
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    bodyLines.join("\n")
  )}`;
};

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    window.location.href = buildMailtoLink(data);
  });
}
