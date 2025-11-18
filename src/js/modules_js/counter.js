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