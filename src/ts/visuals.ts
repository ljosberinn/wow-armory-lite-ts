const cookie = {
  set: (name: string, value: string) => {
    Cookies.set(name, value);
  },
  delete: (name: string) => {
    Cookies.remove(name, null);
  }
};

const tooltip = {
  showTooltip: (element: Element) => {
    element.insertAdjacentHTML("afterend", `<p class="customTooltip fadeIn200" style="width: ${element.dataset.tooltip.length * 6 + 100}px;">${element.dataset.tooltip}</p>`);
  },
  hideTooltip: (targetEl: Element) => {
    targetEl.classList.add("fadeIn200");
    targetEl.classList.remove("fadeIn200");

    setTimeout(() => {
      targetEl.nextElementSibling.remove();
    }, 200);
  }
};

const toggleText = (target: string, state: string) => Array.from(document.querySelectorAll(target)).forEach(el => (state === "show" ? el.classList.add("showText") : el.classList.remove("showText")));

const cards: { open: Function; close: Function; openClose: Function; openFirstCard: Function } = {
  open: (card: string) => {
    const gameCardRegionsSubclass = document.querySelectorAll(`.game-card-regions.${card}`);
    if (gameCardRegionsSubclass.length > 0) {
      gameCardRegionsSubclass[0].classList.add("opened-flag");

      setTimeout(() => {
        toggleText(`.game-card-regions.${card} .region`, "show");
      }, 400);
    }
  },
  close: (cb: Function) => {
    const recentlyClicked = (<HTMLElement>document.querySelector(".flag-recently-clicked")).classList;
    const openRegionInfo = (<HTMLElement>document.querySelector(".game-card.open")).dataset.type;
    toggleText(`.game-card-regions.${openRegionInfo} .region`, "hide");

    setTimeout(() => {
      (<HTMLElement>document.querySelector(`.game-card-regions.${openRegionInfo}`)).classList.remove("opened-flag");

      setTimeout(() => {
        (<HTMLElement>document.querySelector(".game-card.open")).classList.remove("open");
        recentlyClicked.add("open");
        recentlyClicked.remove("flag-recently-clicked");
        cb();
      }, 600);
    }, 300);
  },
  openClose: (card: string) => {
    cards.close(() => {
      cards.open(card);
    });
  },
  openFirstCard: () => {
    const openGame = <HTMLElement>document.querySelector(".all-cards .game-cards .open");

    (<HTMLElement>document.querySelectorAll(".all-cards")[0]).style.width = window.innerWidth <= 1024 ? "100%" : "80%";
    (<HTMLElement>document.querySelectorAll(".game-cards")[0]).style.width = window.innerWidth <= 768 ? "100%" : "50%";

    if (openGame) {
      cards.open(openGame.dataset.type);
    } else {
      const openCard = document.querySelector(".page.show .game-cards");

      if (openCard) {
        const firstGame = openCard.querySelectorAll("div")[0];

        firstGame.classList.add("open");
        cards.open(firstGame.dataset.type);
      }
    }
  }
};

const unloadPage: Function = (newScreenID: string) => {
  const currentlyOpened = <HTMLElement>document.querySelector(".page.show");
  if (currentlyOpened !== undefined) currentlyOpened.classList.remove("show");

  const currentlyClicked = <HTMLElement>document.querySelector(".games-menu ul li.clicked");
  if (currentlyClicked !== undefined) currentlyClicked.classList.remove("clicked");

  const screen = (<HTMLElement>document.querySelector(`.page.${newScreenID}`)).classList;
  ["shrink", "show"].forEach(className => screen.add(className));

  document.querySelectorAll(".game-card")[0].classList.remove("open");

  const currentlyFlagged = <HTMLElement>document.querySelector(".game-card-regions.opened-flag");
  if (currentlyFlagged) currentlyFlagged.classList.remove("opened-flag");

  setTimeout(cards.openFirstCard, 600);

  page.flashImage(newScreenID, () => {
    page.load(newScreenID);
  });
};

const page = {
  cookie: Cookies.get("gm_blizz"),
  load: (id: string) => {
    (<HTMLElement>document.querySelector(`.page.${id}`)).classList.toggle("shrink");
    setTimeout(() => {
      (<HTMLElement>document.querySelector(`.page.${id} .content`)).classList.toggle("show");
      (<HTMLElement>document.querySelector(`.games-menu ul li.${id}`)).classList.toggle("clicked");
    }, 300);
  },
  unload: (newScreenID: string) => {
    const currentPage = document.querySelectorAll(".page.show")[0];
    if (currentPage !== undefined) {
      currentPage.classList.add("shrink");
      document.querySelectorAll(".page.show .content")[0].classList.toggle("show");
    }

    setTimeout(() => {
      unloadPage(newScreenID);
    }, 300);
  },
  loadWithoutAnimation: (section?: string) => {
    let idx = page.cookie;
    if (section) idx = section;

    [`.page.${idx}`, `.page.${idx} .content`].forEach(selector => document.querySelectorAll(selector)[0].classList.toggle("show"));
    document.querySelectorAll(`.games-menu ul li.${idx}`)[0].classList.toggle("clicked");
    cards.openFirstCard();
  },
  flashImage: (id: string, cb: Function) => {
    const screenImage = document.querySelectorAll(`.page.${id} .fullscreenimg`)[0].classList;
    screenImage.add("fadeInOut400");
    setTimeout(() => {
      setTimeout(() => {
        cb();
        screenImage.remove("fadeInOut400");
      }, 400);
    }, 400);
  }
};

const initializeSidebarHover = () => {
  Array.from(document.querySelectorAll(".games-menu li img")).forEach(img => {
    img.addEventListener("mouseover", () => {
      tooltip.showTooltip(img);
    });

    img.addEventListener("mouseleave", () => {
      tooltip.hideTooltip(img);
    });
  });
};

const initializeHamburger = () => {
  Array.from(document.querySelectorAll(".hamburger, .hamburger span")).forEach(hamburgerEl => {
    hamburgerEl.addEventListener("click", () => {
      const hamburger = Array.from(document.querySelectorAll(".hamburger"))[0];
      const toggleState = hamburger.dataset.toggle == "true";
      const hamburgerMenu = document.querySelectorAll(".hamburger-menu")[0];

      if (!toggleState) {
        hamburger.classList.add("open");
        hamburgerMenu.classList.add("opened-flag");
      } else {
        hamburger.classList.remove("open");
        hamburgerMenu.classList.remove("opened-flag");
      }

      hamburger.dataset.toggle = !toggleState;
    });
  });
};

const initializeSideBarListItems = () => {
  Array.from(document.querySelectorAll(".games-menu li")).forEach(li => {
    li.addEventListener("click", () => {
      if (!li.classList.contains("clicked") && document.querySelectorAll(".shrink").length <= 1) {
        const gameIndex: string = li.dataset.index;
        cookie.set("gm_blizz", gameIndex);

        page.unload(
          gameIndex,
          () => {
            page.load();
          },
          300
        );
      }
    });
  });
};

const initializeFirstPageLoad = () => {
  let clicked = document.querySelectorAll(".games-menu ul li.clicked")[0];

  Cookies.get("gm_blizz") ? page.loadWithoutAnimation() : (clicked = document.querySelectorAll(".games-menu ul li")[0]);

  if (clicked !== undefined) {
    clicked.classList.add("clicked");
    cookie.set("gm_blizz", clicked.dataset.index);
    page.loadWithoutAnimation(clicked.dataset.index);
  }
};

const initializeCardOnClick = () => {
  Array.from(document.querySelectorAll(".game-card")).forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.localName === "i") return;

      if (Array.from(document.querySelectorAll(".flag-recently-clicked")).length > 0) return;

      card.classList.add("flag-recently-clicked");
      cards.openClose(card.dataset.type);
    });
  });
};

export const initialize = () => {
  document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.querySelectorAll(".game-card-regions")).forEach(el => el.classList.add("open"));

    initializeHamburger();
    initializeSideBarListItems();
    initializeFirstPageLoad();
    initializeSidebarHover();
    initializeCardOnClick();

    const gameEnabled = document.querySelectorAll(".game-enabled");
    if (gameEnabled.length) {
      cards.open(gameEnabled[0].dataset.type);
    }
  });
};
