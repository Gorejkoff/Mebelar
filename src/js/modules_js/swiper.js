
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
