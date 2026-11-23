function mouseFollow(element, weightX = 10, weightY = 10) {
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * weightX;
    const y = (e.clientY / window.innerHeight - 0.5) * weightY;
    element.style.transform = `translate(${x}px, ${y}px)`;
  });
}

const clickSound = new Audio("media/sounds/click.mp3");
const homeSound = new Audio("media/sounds/home.mp3");

let currentPopup = null;
const Popup = {
  open(title, body, buttons) {
    const popup = document.createElement("div");
    popup.className = "popup active";
    const background = document.createElement("div");
    background.className = "background";
    const container = document.createElement("div");
    container.className = "content";
    const titleDiv = document.createElement("div");
    titleDiv.className = "title";
    titleDiv.textContent = title;
    container.appendChild(titleDiv);
    const bodyDiv = document.createElement("div");
    bodyDiv.className = "body";
    bodyDiv.textContent = body;
    container.appendChild(bodyDiv);
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons";
    buttons.forEach((button) => {
      const buttonDiv = document.createElement("div");
      buttonDiv.className = "button";
      buttonDiv.textContent = button.text;
      buttonDiv.onclick = button.action;
      buttonDiv.setAttribute("data-clickable", "");
      buttonsDiv.appendChild(buttonDiv);
    });

    container.appendChild(buttonsDiv);
    popup.append(background, container);
    document.body.appendChild(popup);
    currentPopup = { popup, container, background };
    const contentAnim = container.animate(
      [
        { opacity: 0, transform: "scale(0.7)" },
        { opacity: 1, transform: "scale(1.03)", offset: 0.7 },
        { opacity: 1, transform: "scale(0.98)", offset: 0.85 },
        { opacity: 1, transform: "scale(1)" },
      ],
      {
        duration: 500,
        easing: "ease-out",
        fill: "forwards",
      },
    );

    const backgroundAnim = background.animate(
      [{ opacity: 0 }, { opacity: 0.7 }],
      {
        duration: 100,
        easing: "ease-out",
        fill: "forwards",
      },
    );
  },

  close() {
    let popupData = null;
    if (currentPopup) popupData = currentPopup;
    else return;
    currentPopup = null;
    const { popup, container, background } = popupData;
    const contentAnim = container.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 1, transform: "scale(1.04)", offset: 0.15 },
        { opacity: 0, transform: "scale(0.7)" },
      ],
      {
        duration: 200,
        easing: "ease-in",
        fill: "forwards",
      },
    );

    const backgroundAnim = background.animate(
      [{ opacity: 0.7 }, { opacity: 0 }],
      {
        duration: 100,
        easing: "ease-in",
        fill: "forwards",
      },
    );

    Promise.all([contentAnim.finished, backgroundAnim.finished]).then(() =>
      popup.remove(),
    );
  },
};

Popup.open(
  "Welcome Title Here",
  "Welcome message here, this one should be a weee bit longer but like icel its your site big man do as you want !!!",
  [
    {
      text: "Woaw",
      action: () => {
        Popup.close();
        const background = document.getElementById("background");
        mouseFollow(background, 12, 12);
        background.play();
        homeSound.play();
      },
    },
    {
      text: "Fuck you dude",
      action: () => {
        Popup.close();
        const background = document.getElementById("background");
        mouseFollow(background, 12, 12);
        background.play();
        homeSound.play();
      },
    },
  ],
);

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-clickable]")) {
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play();
  }
});

function generateApps() {
  const appsDiv = document.getElementById("apps");
  fetch("apps.json")
    .then((data) => data.json())
    .then((apps) => {
      apps.forEach((app, i) => {
        const appDiv = document.createElement("div");
        appDiv.classList = "box app";
        appDiv.setAttribute("data-clickable", "");
        appDiv.setAttribute("data-description", app.description);
        appDiv.onclick = () => {
          window.open(app.url, "_blank");
        };

        const contentDiv = document.createElement("img");
        contentDiv.className = "content";
        contentDiv.src = app.icon;
        appDiv.appendChild(contentDiv);
        const startDiv = document.createElement("div");
        startDiv.className = "start";
        startDiv.textContent = app.name;
        if (i === 0) {
          const disc = document.createElement("div");
          disc.className = "disc";
          appDiv.appendChild(disc);
        }
        appDiv.appendChild(startDiv);
        appsDiv.appendChild(appDiv);
      });
    });
}

generateApps();

const cursor = document.querySelector("#cursor");
document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

const apps = document.querySelector(".apps");
const nav = document.querySelector("#nav");

function updateNav() {
  const styles = getComputedStyle(apps);
  const columns = styles.gridTemplateColumns.split(" ").length;
  const gap = parseFloat(styles.columnGap);

  const width = columns * 208 + (columns - 1) * gap;

  nav.style.width = `${width}px`;
  nav.style.left = `${apps.getBoundingClientRect().left + (apps.offsetWidth - width) / 2}px`;
}

window.addEventListener("resize", updateNav);
updateNav();
