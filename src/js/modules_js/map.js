// map
if (document.getElementById('map')) {
   initMap();
   async function initMap() {
      await ymaps3.ready;
      const { YMap, YMapDefaultSchemeLayer } = ymaps3;
      const map = new YMap(
         document.getElementById('map'),
         {
            location: {
               center: [37.63577597309541, 55.71973092218984],
               zoom: 17,
               duration: 200,
            }
         }
      );

      map.addChild(new YMapDefaultSchemeLayer());
      document.addEventListener('click', (event) => {
         if (event.target.closest('.contacts__cell-button')) {
            const coordinates = event.target.closest('.contacts__cell-button').dataset.map;
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
   }
}