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
})

// отключение кнопки в выборе материалов
if (document.querySelector('.js-material-select')) {
   function checkingButtonsRadio(list, button) {
      const test = list.find(e => e.checked);
      if (!test) {
         disableButtonMaterial(button)
         return;
      }
      enablingButtonMaterial(button)
   }
   function disableButtonMaterial(button) {
      button.setAttribute('disabled', 'true')
   }
   function enablingButtonMaterial(button) {
      button.removeAttribute('disabled')
   }
   const list = document.querySelectorAll('.js-material-select');
   list.forEach((element) => {
      const buttonSubmit = element.querySelector('.js-order-material-button')
      const listRadioButton = Array.from(element.querySelectorAll('[type="radio"]'));
      checkingButtonsRadio(listRadioButton, buttonSubmit)
      element.addEventListener('change', (event) => {
         if (event.target.type === 'radio') {
            checkingButtonsRadio(listRadioButton, buttonSubmit)
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
if (document.querySelector('.banner-video video')) {
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
   let target = document.querySelectorAll('.banner-video video');
   target.forEach(event => observer.observe(event));
}

