import * as REALMS from './realms.json';
import { BlizzardAPI } from './class.blizzard';

const tooltip = {
  showTooltip: (element: HTMLElement) => {
    element.insertAdjacentHTML('afterend', `<p class="customTooltip fadeIn200" style="width: ${element.dataset.tooltip!.length * 6 + 100}px;">${element.dataset.tooltip}</p>`);
  },
  hideTooltip: (targetEl: Element) => {
    targetEl.classList.add('fadeIn200');
    targetEl.classList.remove('fadeIn200');

    setTimeout(() => {
      targetEl.nextElementSibling!.remove();
    }, 200);
  },
};

const toggleText = (target: string, state: string) => Array.from(document.querySelectorAll(target)).forEach(el => (state === 'show' ? el.classList.add('showText') : el.classList.remove('showText')));

const cards: { open: Function; close: Function; openClose: Function; openFirstCard: Function } = {
  open: (card: string) => {
    const gameCardRegionsSubclass = <HTMLElement>document.querySelector(`.card-right.${card}`);
    if (gameCardRegionsSubclass !== null) {
      gameCardRegionsSubclass.classList.add('opened-flag');

      setTimeout(() => {
        toggleText(`.card-right.${card} .card-right-content`, 'show');
      }, 400);
    }
  },
  close: (cb: Function) => {
    const recentlyClicked = (<HTMLElement>document.querySelector('.flag-recently-clicked')).classList;
    const openRegionInfo = (<HTMLElement>document.querySelector('.card-left.open')).dataset.type;
    toggleText(`.card-right.${openRegionInfo} .card-right-content`, 'hide');

    setTimeout(() => {
      (<HTMLElement>document.querySelector(`.card-right.${openRegionInfo}`)).classList.remove('opened-flag');

      setTimeout(() => {
        (<HTMLElement>document.querySelector('.card-left.open')).classList.remove('open');
        recentlyClicked.add('open');
        recentlyClicked.remove('flag-recently-clicked');
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
    const openGame = <HTMLElement>document.querySelector('.all-cards .cards-left-wrapper .open');

    if (openGame) {
      cards.open(openGame.dataset.type);
    } else {
      const openCard = <HTMLDivElement>document.querySelector('.page.show .cards-left-wrapper');

      if (openCard) {
        const firstGame = <HTMLDivElement>openCard.querySelector('div');

        firstGame.classList.add('open');
        cards.open(firstGame.dataset.type);
      }
    }
  },
};

const unloadPage: Function = (newScreenID: string) => {
  const currentlyOpened = <HTMLElement>document.querySelector('.page.show');
  if (currentlyOpened !== null) currentlyOpened.classList.remove('show');

  const currentlyClicked = <HTMLElement>document.querySelector('.menu ul li.clicked');
  if (currentlyClicked !== null) currentlyClicked.classList.remove('clicked');

  const screen = (<HTMLElement>document.querySelector(`.page.${newScreenID}`)).classList;
  ['shrink', 'show'].forEach(className => screen.add(className));

  (<HTMLElement>document.querySelector('.card-left.open')).classList.remove('open');

  const currentlyFlagged = <HTMLElement>document.querySelector('.card-right.opened-flag');
  if (currentlyFlagged) currentlyFlagged.classList.remove('opened-flag');

  setTimeout(cards.openFirstCard, 600);

  page.flashImage(newScreenID, () => {
    page.load(newScreenID);
  });
};

const page = {
  load: (id: string) => {
    (<HTMLElement>document.querySelector(`.page.${id}`)).classList.toggle('shrink');
    setTimeout(() => {
      (<HTMLElement>document.querySelector(`.page.${id} .content`)).classList.toggle('show');
      (<HTMLElement>document.querySelector(`.menu ul li.${id}`)).classList.toggle('clicked');
    }, 300);
  },
  unload: (newScreenID: string) => {
    const currentPage = document.querySelectorAll('.page.show')[0];
    if (currentPage !== undefined) {
      currentPage.classList.add('shrink');
      (<HTMLElement>document.querySelector('.page.show .content')).classList.toggle('show');
    }

    setTimeout(() => {
      unloadPage(newScreenID);
    }, 300);
  },
  loadWithoutAnimation: (section: string) => {
    [`.page.${section}`, `.page.${section} .content`].forEach(selector => (<HTMLElement>document.querySelector(selector)).classList.toggle('show'));
    (<HTMLElement>document.querySelector(`.menu ul li.${section}`)).classList.toggle('clicked');
    cards.openFirstCard();
  },
  flashImage: (id: string, cb: Function) => {
    const screenImage = (<HTMLElement>document.querySelector(`.page.${id} .fullscreen-img`)).classList;
    screenImage.add('fadeInOut400');
    setTimeout(() => {
      setTimeout(() => {
        cb();
        screenImage.remove('fadeInOut400');
      }, 400);
    }, 400);
  },
};

const initializeSidebarHover = () => {
  Array.from(<HTMLCollectionOf<HTMLElement>>document.querySelectorAll('.menu li img')).forEach(img => {
    img.addEventListener('mouseover', () => {
      tooltip.showTooltip(img);
    });

    img.addEventListener('mouseleave', () => {
      tooltip.hideTooltip(img);
    });
  });
};

const initializeHamburger = () => {
  Array.from(<HTMLCollectionOf<HTMLElement>>document.querySelectorAll('.hamburger, .hamburger span')).forEach(hamburgerEl => {
    hamburgerEl.addEventListener('click', () => {
      const hamburger = <HTMLElement>document.querySelector('.hamburger');
      const toggleState = hamburger.dataset.toggle == 'true';
      const hamburgerMenu = <HTMLElement>document.querySelector('.hamburger-menu');

      if (!toggleState) {
        hamburger.classList.add('open');
        hamburgerMenu.classList.add('opened-flag');
      } else {
        hamburger.classList.remove('open');
        hamburgerMenu.classList.remove('opened-flag');
      }

      hamburger.dataset.toggle = (!toggleState).toString();
    });
  });
};

const initializeSideBarListItems = () => {
  Array.from(<HTMLCollectionOf<HTMLElement>>document.querySelectorAll('.menu li')).forEach(li => {
    li.addEventListener('click', () => {
      if (!li.classList.contains('clicked') && document.querySelectorAll('.shrink').length <= 2) {
        page.unload(
          li.dataset.index!,
          () => {
            page.load();
          },
          300,
        );
      }
    });
  });
};

const initializeFirstPageLoad = () => {
  const clicked = <HTMLElement>document.querySelector('.menu ul li');
  clicked.classList.add('clicked');
  page.loadWithoutAnimation(clicked.dataset.index!);
};

const initializeCardOnClick = () => {
  Array.from(<HTMLCollectionOf<HTMLElement>>document.querySelectorAll('.card-left')).forEach(card => {
    card.addEventListener('click', e => {
      if (e.target!.localName === 'i') return;

      if (Array.from(document.querySelectorAll('.flag-recently-clicked')).length > 0) return;

      card.classList.add('flag-recently-clicked');
      cards.openClose(card.dataset.type);
    });
  });
};

const initializeTabSwitcher = () => {
  const tabs = Array.from(<HTMLCollectionOf<HTMLDivElement>>document.querySelectorAll('.tabs'));

  tabs.forEach(tabContainer => {
    const tabNav = Array.from(<HTMLCollectionOf<HTMLDivElement>>tabContainer.querySelectorAll('.tabs-nav div'));
    const tabContent = Array.from(<HTMLCollectionOf<HTMLDivElement>>tabContainer.querySelectorAll('.tabs-content div'));

    tabNav.forEach(navEl => {
      navEl.addEventListener('click', function () {
        const _this = this;

        tabNav.forEach(recursiveNavEl => {
          if (recursiveNavEl === _this) {
            recursiveNavEl.classList.add('active');
          } else if (recursiveNavEl.classList.contains('active')) {
            recursiveNavEl.classList.remove('active');
          }
        });

        tabContent.forEach(content => {
          const cList = content.classList;
          if (content.id === this.dataset.target!) {
            cList.add('active');
          } else if (cList.contains('active')) {
            cList.remove('active');
          }
        });
      });
    });
  });
};

interface IRealmsObject {
  [key: number]: IRealmsRegionObject;
}

interface IRealmsRegionObject {
  [key: number]: IRealmsRegionRealmObject;
}

interface IRealmsRegionRealmObject {
  name: string;
  slug: string;
  ownerrealm: null | string;
  sanitized: string;
}

const populateRealmArr = (): IRealmLookupObj => {
  const defaultSubObj = Object.values(Object.entries(REALMS))[2][1];

  const realms: string[] = [];
  const slugs: string[] = [];

  const regions = ['US', 'EU'];

  defaultSubObj.forEach((region: IRealmsRegionObject) => {
    const index = defaultSubObj.indexOf(region);

    Object.values(region).forEach((realmObj: IRealmsRegionRealmObject) => {
      realms.push(`${regions[index]}-${realmObj.name}`);
      slugs.push(realmObj.slug);
    });
  });

  return { realms, slugs };
};

const emptyDatalist = (target: HTMLDataListElement) => {
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }
};

const appendToLookupDatalist = (target: HTMLDataListElement, options: string[]) => {
  const fragment = document.createDocumentFragment();

  options.forEach(optionVal => {
    const option = document.createElement('option');
    option.value = optionVal;
    fragment.appendChild(option);
  });

  target.appendChild(fragment);
};

const initializeSearch = () => {
  const form = <HTMLFormElement>document.getElementById('lookup-form');
  const characterInput = <HTMLInputElement>document.getElementById('lookup-character');
  const realmInput = <HTMLInputElement>document.getElementById('lookup-realm');
  const realmList = <HTMLDataListElement>document.getElementById('lookup-realms-dl');
  const realmLookupObj: IRealmLookupObj = populateRealmArr();

  form.addEventListener('submit', e => {
    e.preventDefault();

    const sanitziedRealm = realmLookupObj.slugs[realmLookupObj.realms.indexOf(realmInput.value)];
    const region = realmInput.value.split('-')[0];

    new BlizzardAPI(characterInput.value, region, sanitziedRealm);
  });

  characterInput.addEventListener('input', function () {
    const currLen = this.value.length;
    this.dataset.state = currLen >= 2 && currLen <= 12 ? 'valid' : 'invalid';
    toggleButton(this.dataset.state, realmInput.dataset.state!);
  });

  realmInput.addEventListener('input', function () {
    if (this.value.length > 3) {
      const foundRealms = realmLookupObj.realms.filter(realm => new RegExp(this.value, 'i').test(realm));

      if (foundRealms.length > 0) {
        this.dataset.state = 'valid';

        emptyDatalist(realmList);
        appendToLookupDatalist(realmList, foundRealms);
      } else {
        this.dataset.state = 'invalid';
      }

      toggleButton(characterInput.dataset.state!, this.dataset.state);
    }
  });
};

const toggleButton = (cInputState: string, rInputState: string) => ((<HTMLButtonElement>document.getElementById('lookup-submit')).disabled = !(cInputState === 'valid' && rInputState === 'valid'));

export const initVisuals = () => {
  document.addEventListener('DOMContentLoaded', () => {
    Array.from(<HTMLCollectionOf<HTMLElement>>document.querySelectorAll('.card-right')).forEach(el => el.classList.add('open'));

    initializeHamburger();
    initializeSideBarListItems();
    initializeFirstPageLoad();
    initializeSidebarHover();
    initializeCardOnClick();
    initializeTabSwitcher();
    initializeSearch();

    const gameEnabled = <HTMLElement>document.querySelector('.game-enabled');
    if (gameEnabled) {
      cards.open(gameEnabled.dataset.type);
    }
  });
};
