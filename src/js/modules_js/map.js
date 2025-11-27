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