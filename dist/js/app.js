"use strict"

// window.addEventListener('load', (event) => {});

// desktop or mobile (mouse or touchscreen)
const isMobile = {
   Android: function () { return navigator.userAgent.match(/Android/i) },
   BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i) },
   iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i) },
   Opera: function () { return navigator.userAgent.match(/Opera Mini/i) },
   Windows: function () { return navigator.userAgent.match(/IEMobile/i) },
   any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
   }
};
const isPC = !isMobile.any();
if (isPC) { document.body.classList.add('_pc') } else { document.body.classList.add('_touch') };

// media queries
const MIN1024 = window.matchMedia('(min-width: 1024px)');
const MIN768 = window.matchMedia('(min-width: 768px)');

// variables
const HEADER = document.getElementById('header');

function throttle(callee, timeout) {
   let timer = null;
   return function perform(...args) {
      if (timer) return;
      timer = setTimeout(() => {
         callee(...args);
         clearTimeout(timer);
         timer = null;
      }, timeout)
   }
}

/* запись переменных высоты элементов */
function addHeightVariable() {
   if (typeof HEADER !== "undefined") {
      document.body.style.setProperty('--height-header', `${HEADER.offsetHeight}px`)
   }
}
addHeightVariable();

// ** ======================= RESIZE ======================  ** //
window.addEventListener('resize', () => {
   addHeightVariable();
   closeHeaderMenu();
})

// ** ======================= CLICK ======================  ** //
document.documentElement.addEventListener("click", (event) => {
   if (event.target.closest('.js-open-mobile-menu')) { openHeaderMenu() }
   if (event.target.closest('.banner-video__play')) { playVideo(event) }
   if (!isPC && event.target.closest('.experience__image')) { event.target.closest('.experience__image').classList.toggle('active') }
})

// отключение кнопки в выборе материалов
if (document.querySelector('.js-material-select')) {
   const list = document.querySelectorAll('.js-material-select');
   function checkingButtonsRadio() {
      list.forEach(e => {
         const buttonSubmit = e.querySelector('.js-order-material-button')
         const listRadioButton = Array.from(e.querySelectorAll('[type="radio"]'));
         const test = listRadioButton.find(e => e.checked);
         if (!test) {
            disableButtonMaterial(buttonSubmit)
            return;
         }
         enablingButtonMaterial(buttonSubmit)
      })

   }
   function disableButtonMaterial(button) {
      button.setAttribute('disabled', 'true')
   }
   function enablingButtonMaterial(button) {
      button.removeAttribute('disabled')
   }
   checkingButtonsRadio()
   list.forEach((element) => {
      element.addEventListener('change', (event) => {
         if (event.target.type === 'radio') {
            checkingButtonsRadio()
         }
      })
   })
}


function openHeaderMenu() {
   document.body.classList.toggle('menu-is-open')
}
function closeHeaderMenu() {
   document.body.classList.remove('menu-is-open')
}

//  запуск видео
if (document.querySelector('.autoplay video')) {
   let callback = function (entries, observer) {
      entries.forEach((entry) => {
         if (entry.isIntersecting) {
            entry.target.play();
            return
         }
         entry.target.pause();
      })
   };
   let observer = new IntersectionObserver(callback, { threshold: 0.2 });
   let target = document.querySelectorAll('.autoplay video');
   target.forEach(event => observer.observe(event));
}

function playVideo(event) {
   const banner = event.target.closest('.banner-video');
   const button = event.target.closest('.banner-video__play');
   if (!banner) return;
   const video = banner.querySelector('video');
   if (!video) return;
   console.log(video);
   video.setAttribute('controls', '')
   video.play();
   button.classList.add('hidden');
}


if (document.querySelector('.search__input')) {
   const input = document.querySelector('.search__input');
   const result = document.querySelector('.search__result');
   function openResult() {
      result.classList.add('active');
   }
   function closeResult() {
      result.classList.remove('active');
   }
   input.addEventListener('input', (event) => {
      input.value = input.value.trim()
      if (input.value.length > 0) { openResult() }
      if (input.value.length == 0) { closeResult() }
   })
   document.body.addEventListener('click', (event) => {
      if (event.target.closest('.search__clear')) {
         input.value = '';
         closeResult();
      }
      if (event.target.closest('.search__result-item')) {
         closeResult();
      }
   })
}

// перемещение блоков при адаптиве
// data-da=".class,3,768,min" 
// класс родителя куда перемещать
// порядковый номер в блоке куда перемещается начиная с 0 как индексы массива
// viewport
// min = min-width, max = max-width
// два перемещения: data-da=".class,3,768,min,.class2,1,1024,max"
const ARRAY_DATA_DA = document.querySelectorAll('[data-da]');
ARRAY_DATA_DA.forEach(function (e) {
   const dataArray = e.dataset.da.split(',');
   const addressMove = searchDestination(e, dataArray[0]);
   const addressMoveSecond = dataArray[4] && searchDestination(e, dataArray[4]);
   const addressParent = e.parentElement;
   const listChildren = addressParent.children;
   const direction = dataArray[3] || 'min';
   const directionSecond = dataArray[7] || 'min';
   const mediaQuery = window.matchMedia(`(${direction}-width: ${dataArray[2]}px)`);
   const mediaQuerySecond = dataArray[6] && window.matchMedia(`(${directionSecond}-width: ${dataArray[6]}px)`);
   for (let i = 0; i < listChildren.length; i++) { !listChildren[i].dataset.n && listChildren[i].setAttribute('data-n', `${i}`) };
   mediaQuery.matches && startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   if (mediaQuerySecond && mediaQuerySecond.matches) moving(e, dataArray[5], addressMoveSecond);
   mediaQuery.addEventListener('change', () => { startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) });
   if (mediaQuerySecond) mediaQuerySecond.addEventListener('change', () => {
      if (mediaQuerySecond.matches) { moving(e, dataArray[4], addressMoveSecond); return; };
      startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   });
});

function startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) {
   if (mediaQuery.matches) { moving(e, dataArray[1], addressMove); return; }
   if (listChildren.length > 0) {
      for (let z = 0; z < listChildren.length; z++) {
         if (listChildren[z].dataset.n > e.dataset.n) {
            listChildren[z].before(e);
            break;
         } else if (z == listChildren.length - 1) {
            addressParent.append(e);
         }
      }
      return;
   }
   addressParent.prepend(e);
};

function searchDestination(e, n) {
   if (!e) return;
   if (e.classList.contains(n.slice(1))) { return e }
   if (e.parentElement && e.parentElement.querySelector(n)) { return e.parentElement.querySelector(n) };
   return searchDestination(e.parentElement, n);
}

function moving(e, order, addressMove) {
   if (order == "first") { addressMove.prepend(e); return; };
   if (order == "last") { addressMove.append(e); return; };
   if (addressMove.children[order]) { addressMove.children[order].before(e); return; }
   addressMove.append(e);
}



if (document.querySelector('.js-count')) {
   document.body.addEventListener('click', (event) => {
      if (event.target.closest('.js-count-dicrement')) {
         const input = event.target.closest('.js-count').querySelector('.js-count-value');
         input.value = Number(input.value) - 1;
         validationQuantityBasket(input);
      }
      if (event.target.closest('.js-count-increment')) {
         const input = event.target.closest('.js-count').querySelector('.js-count-value');
         input.value = Number(input.value) + 1;
         validationQuantityBasket(input);
      }
   })

   // проверка количесва товара в корзине
   const QUANTITY_BASKET = document.querySelectorAll('.js-count-value');
   QUANTITY_BASKET.forEach((e) => {
      e.addEventListener('change', () => validationQuantityBasket(e));
   })
   function validationQuantityBasket(e) {
      if (Number(e.max) && Number(e.max) < Number(e.value)) {
         e.value = Number(e.max);
         return;
      }
      if (Number(e.min) && Number(e.min) > Number(e.value)) {
         e.value = Number(e.min);
         return;
      }
   }
}
// map
if (document.getElementById('map')) {
   const mapElement = document.getElementById('map');
   const data = {
      coordinates: '37.63577597309541, 55.71973092218984',
      text: 'г. Москва, ул. Дубининская, д.57 стр.4'
   }
   initMap();
   async function initMap() {
      await ymaps3.ready;
      const { YMap, YMaps, YMapMarker, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;
      const map = new YMap(
         document.getElementById('map'),
         {
            location: {
               center: data.coordinates.split(','),
               zoom: 17,
               duration: 200,
            }
         }, [
         new YMapDefaultSchemeLayer(),
         new YMapDefaultFeaturesLayer()
      ]
      );

      const listData = document.querySelectorAll('.contacts__cell-button');
      const markerTemplate = document.getElementById('marker');


      function addMarker(element) {

         const coordinates = element.dataset.coordinates;
         const text = element.dataset.marker
         const markerClone = markerTemplate.content.cloneNode(true);
         markerClone.querySelector('.marker-address').innerHTML = text;

         const marker = new YMapMarker(
            {
               coordinates: coordinates ? coordinates.split(',') : data.coordinates.split(','),
            },
            markerClone
         );

         map.addChild(marker);
      }

      listData.forEach(element => addMarker(element))

      document.addEventListener('click', (event) => {
         if (event.target.closest('.contacts__cell-button')) {
            const coordinates = event.target.closest('.contacts__cell-button').dataset.coordinates;
            if (coordinates) {
               map.update({
                  location: {
                     center: coordinates.split(','),
                     zoom: 17,
                     duration: 200,
                  }
               })
            }
         }
      })

      mapElement.addEventListener('click', (event) => {
         if (event.target.closest('.map-marker')) {
            event.target.closest('.map-marker').classList.toggle('active');
         }
      })

   }
}
/* открывает, закрывает модальные окна. */
/*
добавить классы
js-modal-hidden - родительский контейнер модального окна который скрывается и показывается, задать стили скрытия
js-modal-visible - задать стили открытия
js-modal-close - кнопка закрытия модального окна находится внутри js-modal-hidde
кнопка открытия, любая:
js-modal-open - кнопка открытия модального окна
data-modal_open="id" - id модального окна
если надо что бы окно закрывалось при клике на пустое место (фон), добавляется атрибут js-modal-stop-close.
js-modal-stop-close - атрибут указывает на поле, при клике на которое не должно происходить закрытие окна, 
т.е. контейнер контента, при этом внешний родительский контейнет помечается атрибутом js-modal-close.
допускается дополнительно кнопка закрытия внутри js-modal-stop-close.
*/
document.addEventListener('click', (event) => {
   if (event.target.closest('.js-modal-open')) { openModal(event) }
   if (event.target.closest('.js-modal-close')) { testModalStopClose(event) }
})
function openModal(event) {
   event.preventDefault();
   let id = event.target.closest('.js-modal-open').dataset.modal_open;
   if (typeof id !== "undefined") { initOpenModal(id) };
}
function testModalStopClose(event) {
   if (event.target.closest('.js-modal-stop-close') &&
      event.target.closest('.js-modal-stop-close') !==
      event.target.closest('.js-modal-close').closest('.js-modal-stop-close')) {
      return
   }
   closeModal(event);
}
function closeModal(event) {
   event.target.closest('.js-modal-hidden').classList.remove('js-modal-visible');
   activeScrollCloseModal();
}
// функция закрытия модального окна (передать id модального окна)
function initCloseModal(id) {
   if (document.querySelector(`#${id}`)) {
      document.querySelector(`#${id}`).classList.remove('js-modal-visible');
   }
   activeScrollCloseModal();
}
// функция открытия модального окна (передать id модального окна)
function initOpenModal(id) {
   if (document.querySelector(`#${id}`)) {
      document.querySelector(`#${id}`).classList.add('js-modal-visible');
      document.body.classList.add('body-overflow')
   }
}
function activeScrollCloseModal() {
   if (!document.querySelector('.js-modal-visible')) {
      document.body.classList.remove('body-overflow');
   }
}


if (document.querySelector('.banner-fade__swiper')) {
   const element = document.querySelector('.banner-fade__swiper');
   const buttonNext = element.querySelector('.button-next')
   const buttonPrev = element.querySelector('.button-prev')
   const delay = 3000;
   const speed = 500;
   const swiper = new Swiper(element, {
      // spaceBetween: 30,
      allowTouchMove: true,
      // loop: true,
      speed: speed,
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: {
         crossFade: false,
      },
      // autoplay: {
      //    delay: delay,
      // },
      navigation: {
         nextEl: buttonNext,
         prevEl: buttonPrev,
      },
   });

   const nextSlider = () => { swiper.slideNext(speed) }
   const toBeginning = () => {
      clearTimeout(nextSliderTime)
      swiper.slideTo(0, speed)
   }
   let nextSliderTime = null;
   let toBeginningTime = null;
   swiper.on('slideChange', () => {
      nextSliderTime = setTimeout(nextSlider, delay)
   })
   swiper.on('reachEnd', () => {
      clearTimeout(nextSliderTime)
      toBeginningTime = setTimeout(toBeginning, delay)
   })
   const brforeClick = () => {
      clearTimeout(nextSliderTime);
   }
   buttonPrev.addEventListener('click', () => { brforeClick() });
   buttonNext.addEventListener('click', () => { brforeClick() });
   setTimeout(nextSlider, delay);
}


if (document.querySelector('.swiper-block')) {
   const swiperList = document.querySelectorAll('.swiper-block');
   swiperList.forEach(e => {
      const swiper = new Swiper(e.querySelector('.swiper'), {
         // allowTouchMove: false,
         spaceBetween: 10,
         speed: 300,
         grabCursor: true,
         slidesPerView: 1.12,
         navigation: {
            nextEl: ".next",
            prevEl: ".prev",
         },
         breakpoints: {
            1024: {
               slidesPerView: 4
            },
            768: {
               slidesPerView: 2.2
            }
         },
         // pagination: {
         //    el: e.querySelector('.swiper-pagination'),
         //    type: 'bullets',
         //    clickable: true,
         // },
         scrollbar: {
            el: e.querySelector('.swiper-pagination'),
         },
      });
   })
}

if (document.querySelector('.card-production__swiper-body')) {
   const wrapper = document.querySelector('.card-production__swiper-body');
   const swiper = new Swiper(wrapper.querySelector('.swiper'), {
      loop: true,
      spaceBetween: 10,
      speed: 300,
      slidesPerView: 1,
      grabCursor: true,

      navigation: {
         nextEl: wrapper.querySelector('.button-next'),
         prevEl: wrapper.querySelector('.button-prev'),
      },

   });
}

if (document.querySelector('.slider-wide__swiper')) {
   const listElement = document.querySelectorAll('.slider-wide__swiper');

   listElement.forEach(e => {

      const swiper = new Swiper(e, {
         loop: true,
         spaceBetween: 0,
         speed: 300,
         slidesPerView: 1.43,
         grabCursor: true,
         initialSlide: 2,
         centeredSlides: true,
         breakpoints: {
            768: {
               slidesPerView: 2.85
            }
         },
         navigation: {
            nextEl: e.querySelector('.button-next'),
            prevEl: e.querySelector('.button-prev'),
         },
      });
   })
}

if (document.querySelector('.home__news-swiper')) {
   const swiper = new Swiper('.home__news-swiper', {
      spaceBetween: 16,
      speed: 300,
      slidesPerView: 1.8,
      breakpoints: {
         1024: {
            spaceBetween: 20,
            slidesPerView: 3
         }
      },
   });
}
if (document.querySelector('.home__swiper')) {
   const homeSwiper = document.querySelector('.home__swiper')
   const swiper = new Swiper(homeSwiper, {
      spaceBetween: 16,
      speed: 300,
      slidesPerView: 1,
      grabCursor: true,
      navigation: {
         nextEl: homeSwiper.querySelector('.button-next'),
         prevEl: homeSwiper.querySelector('.button-prev'),
      },
   });
}

/* пример инициализации слайдера */
// if (document.querySelector('.swiper')) {
//    const swiper = new Swiper('.swiper', {
//       keyboard: {
//          enabled: true,
//          onlyInViewport: true,
//       },
//       allowTouchMove: false,
//       loop: true,
//       spaceBetween: 10,
//       speed: 300,
//       slidesPerView: 2.5,
//       slidesPerView: 'auto', // количаство слайдеров без авто ширины
//       grabCursor: true,
//       initialSlide: 2,
//       centeredSlides: true,
//       breakpoints: {
//          1024: {
//             spaceBetween: 20,
//             slidesPerView: 3
//          },
//          768: {
//             slidesPerView: 2
//          }
//       },
//       navigation: {
//          nextEl: ".next",
//          prevEl: ".prev",
//       },
//       pagination: {
//          el: '.pagination__body',
//          type: 'bullets',
//          type: 'fraction',
//          clickable: true,
//       },
//       autoplay: {
//          delay: 2000,
//       },
//       virtual: {
//          enabled: true,
//       },
//       freeMode: {
//          enabled: true,
//          momentum: false // Отключаем инерцию для точного позиционирования
//       },
//    });
// }




/* создание и ликвидация состояния слайдера в зависимости от ширины вьюпорта */
// if (document.querySelector('.swiper')) {
//    let swiperState;
//    let swiper;
//    changeStateSlider();
//    window.addEventListener('resize', () => {
//       changeStateSlider();
//    })
//    function initswiper() {
//       swiper = new Swiper('.swiper', {
//          keyboard: {
//             enabled: true,
//             onlyInViewport: true,
//          },
//          allowTouchMove: true,
//          loop: false,
//          speed: 300,
//          slidesPerView: 1.3,
//          spaceBetween: 24,
//       });
//    }
//    function changeStateSlider() {
//       if (!MIN768.matches) {
//          if (!swiperState) {
//             swiperState = true;
//             initswiper();
//          }
//       } else {
//          if (swiperState) {
//             swiperState = false;
//             swiper.destroy(true, true);
//          }
//       }
//    }
// }

// js-tabs-body - тело вкладки, в открытом состоянии добавляется класс js-tabs-open.
// * !!! где js-tabs-body, добавить data-tabs-duration="500" скорость анимации в 'мс', 500мс по умолчанию.
// js-tabs-hover - работает hover на ПК, отключает клик на ПК, для touchscreen надо раставить js-tabs-click или js-tabs-toggle
// js-tabs-closing - вместе с js-tabs-bod закрыть вкладку при событии вне данной вкладки
// js-tabs-click - открыть при клике (зона клика)
// js-tabs-toggle - открыть или закрыть при клике (зона клика)
// js-tabs-group - обвернуть группу табов, что бы был открыт только один из группы,
// js-tabs-group-all - если внутри табов есть дочерние табы сгруппированные js-tabs-group, тогда можно группу родительских табов обвернуть в js-tabs-group-all, тогда при переключении родительского таба будут закрываться все дочерние табы
// js-tabs-shell - оболочка скрывающая js-tabs-inner, присвоить стили  transition: height var(--tabs-duration, 0,5s);
// js-tabs-inner - оболочка контента
//
//
// работает в связке с определением touchscreen  (isPC)


class Tabs {
   constructor() {
      this.listClosingTabs = document.querySelectorAll('.js-tabs-closing');
      this.listHover = document.querySelectorAll('.js-tabs-hover');
      this.listTabsBody = document.querySelectorAll('.js-tabs-body');
   };
   init = () => {
      const listDuration = document.querySelectorAll('[data-tabs_duration]');
      listDuration.forEach((e) => e.style.setProperty('--tabs-duration', e.dataset.tabs_duration / 1000 + 's'))
      document.body.addEventListener('click', this.eventClick);
      if (isPC) document.body.addEventListener('mouseover', this.eventMouseOver)
      // window.addEventListener('resize', this.resize);
   };
   querySelectExcluding = (groupItem) => {
      const allElements = groupItem.querySelectorAll('.js-tabs-body');
      const excludeElements = groupItem.querySelectorAll('.js-tabs-group');
      return Array.from(allElements).filter(element => {
         return !Array.from(excludeElements).some(excludeEl =>
            excludeEl !== element && excludeEl.contains(element)
         );
      });
   }
   eventMouseOver = (event) => {
      if (event.target.closest('.js-tabs-hover')) this.openTabs(event.target);
      this.closeAllHover(event.target);
   };
   eventClick = (event) => {
      if (isPC && event.target.closest('.js-tabs-hover')) return;
      this.closeAll(event);

      if (event.target.closest('.js-tabs-click')) {
         if (event.target.closest('.js-tabs-group')) { this.closeGroup(event) }
         if (event.target.closest('.js-tabs-group-all') && !event.target.closest('.js-tabs-group')) { this.closeGroupAll(event) }
         this.openTabs(event.target)
      };
      if (event.target.closest('.js-tabs-toggle')) {
         if (event.target.closest('.js-tabs-group')) { this.closeGroup(event) }
         if (event.target.closest('.js-tabs-group-all') && !event.target.closest('.js-tabs-group')) { this.closeGroupAll(event) }
         this.toggleTabs(event.target)
      };
   };
   // не закрывает табы дочерних js-tabs-group
   closeGroup = (event) => {
      const groupFilter = this.querySelectExcluding(event.target.closest('.js-tabs-group'))
      groupFilter.forEach((e) => {
         if (event.target.closest('.js-tabs-toggle') && event.target.closest('.js-tabs-toggle') == (e.querySelector('.js-tabs-toggle') || e.closest('.js-tabs-toggle'))) return;
         if (event.target.closest('.js-tabs-click') && event.target.closest('.js-tabs-click') == (e.querySelector('.js-tabs-click') || e.closest('.js-tabs-click'))) return;
         this.closeTabs(e)
      })
   }
   // закрывает все табы внутри js-tabs-group-all
   closeGroupAll = (event) => {
      const group = event.target.closest('.js-tabs-group-all').querySelectorAll('.js-tabs-body');
      group.forEach((e) => {
         if (event.target.closest('.js-tabs-toggle') && event.target.closest('.js-tabs-toggle') == (e.querySelector('.js-tabs-toggle') || e.closest('.js-tabs-toggle'))) return;
         if (event.target.closest('.js-tabs-click') && event.target.closest('.js-tabs-click') == (e.querySelector('.js-tabs-click') || e.closest('.js-tabs-click'))) return;
         this.closeTabs(e)
      })
   }
   openTabs = (element) => {
      const body = element.closest('.js-tabs-body');
      if (!body) return;
      body.classList.add('js-tabs-open');
      this.setHeight(body);
   };
   closeTabs = (body) => {
      body.classList.remove('js-tabs-open');
      this.clearHeight(body);
   };
   closeAll = (event) => {
      const body = event.target.closest('.js-tabs-body');
      if (this.listClosingTabs.length == 0 && body) return;
      this.listClosingTabs.forEach((e) => { if (e !== body) this.closeTabs(e); })
   };
   closeAllHover = (element) => {
      const body = element.closest('.js-tabs-hover');
      if (this.listHover.length == 0 && body) return;
      this.listHover.forEach((e) => { if (e !== body) this.closeTabs(e) })
   };
   setHeight = (body) => {
      const heightValue = body.querySelector('.js-tabs-inner').offsetHeight;
      const duration = body.dataset.tabs_duration;
      body.querySelector('.js-tabs-shell').style.height = heightValue + "px";
      setTimeout(() => {
         if (body.querySelector('.js-tabs-shell').style.height == '') return;
         body.querySelector('.js-tabs-shell').style.height = 'auto'
      }, duration || 500)
   };
   clearHeight = (body) => {
      const heightValue = body.querySelector('.js-tabs-inner').offsetHeight;
      body.querySelector('.js-tabs-shell').style.height = heightValue + "px";
      requestAnimationFrame(() => { body.querySelector('.js-tabs-shell').style.height = "" })
   }
   toggleTabs = (element) => {
      const body = element.closest('.js-tabs-body');
      if (body.classList.contains('js-tabs-open')) {
         this.closeTabs(body);
         return;
      }
      this.openTabs(element);
   };
}
const tabs = new Tabs();
tabs.init();

if (document.querySelector('.numbered-list')) {
   tabs.openTabs(document.querySelector('.numbered-list'))
}
if (document.querySelector('.material__body')) {
   tabs.openTabs(document.querySelector('.material__body'))
}






class TabsSwitching {
   constructor(button_name, tab_name, execute) {
      this.name_button = button_name;
      this.list_buttons = document.querySelectorAll(button_name);
      this.list_tabs = document.querySelectorAll(tab_name);
      this.execute = execute;
   }
   init = () => {
      document.body.addEventListener('click', (event) => {
         if (event.target.closest(this.name_button)) {
            actionTabsSwitching(event, event.target.closest(this.name_button), this.list_buttons, this.list_tabs, this.execute)
         }
      })
   }
}

function actionTabsSwitching(event, target_button, list_buttons, list_tabs, execute) {
   let number = target_button.dataset.button_ts;
   if (!number) return;
   list_buttons.forEach((e) => { e.classList.toggle('active', e.dataset.button_ts == number) });
   if (list_tabs.length > 0) { list_tabs.forEach((e) => { e.classList.toggle('active', e.dataset.tab_ts == number) }) }
   if (execute) { this.execute(event) };
}

function addTabsSwitching(button_name, tab_name, fn_name) {
   if (document.querySelector(button_name) && document.querySelector(tab_name)) {
      let tab = new TabsSwitching(button_name, tab_name, fn_name);
      tab.init();
   }
}

addTabsSwitching('.modal__tab-batton', '.modal__tab')
// addTabsSwitching('.button_name', '.tab_name', '.fn_name')


