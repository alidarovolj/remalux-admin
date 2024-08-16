<template>
  <div>
    <div id="map" style="width: 100%; height: 335px;"></div>
  </div>
</template>

<script>
export default {
  name: 'MapWithSearch',
  data() {
    return {
      map: null,
      searchControl: null,
    };
  },
  props: {
    location: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    window.ymapsReady.then((ymaps) => {
      this.initMap(ymaps);
    }).catch((error) => {
      console.error('Error loading Yandex Maps:', error);
    });
  },
  methods: {
    initMap(ymaps) {
      ymaps.ready(() => {
        this.map = new ymaps.Map('map', {
          center: this.$props.location ? [this.$props.location.latitude, this.$props.location.longitude] : [43.273564, 76.914851],
          zoom: 10,
          controls: ['zoomControl', 'searchControl'],
        });

        this.searchControl = this.map.controls.get('searchControl');

        this.searchControl.events.add('resultselect', (e) => {
          const index = e.get('index');
          this.searchControl.getResult(index).then((result) => {
            const address = result.properties.get('text');
            const coordinates = result.geometry.getCoordinates();
            const longitude = coordinates[0];
            const latitude = coordinates[1];
            this.$emit('send_data', { address, longitude, latitude });
          }).catch((error) => {
            console.error('Error retrieving search result:', error);
          });
        });
      });
    },
  },
};
</script>