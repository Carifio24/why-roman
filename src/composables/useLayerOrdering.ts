/* eslint-disable @typescript-eslint/no-unused-vars */
import { engineStore } from '@wwtelescope/engine-pinia';
import { WWTControl, LayerManager, Place, Layer, ImageSetLayer } from '@wwtelescope/engine';

export function useLayerOrdering() {
  const store = engineStore();


  function getImageSetLayerOrder(id) {
    const layer = LayerManager.get_layerList()[id];
    const layers = LayerManager.get_allMaps()[layer.get_referenceFrame()].layers;
    const order = layers.indexOf(layer);
    return order > -1 ? order : null;
  }

  function setImagesetLayerOrder(id, order) {
    store.setImageSetLayerOrder({
      id: id,
      order: order
    });
  }

  function getPlaceImageSetLayer(place: Place) {
    const imgset = place.get_backgroundImageset() ?? place.get_studyImageset();
    if (!imgset) {
      return null;
    }
    for (const layerState of store.activeImagesetLayerStates) {
      const iset = store.imagesetForLayer(layerState.getGuid()); // just returns the Imageset not the layer
      if (iset && iset.get_imageSetID() === imgset.get_imageSetID()) {
        return store.imagesetLayerById(layerState.getGuid()); // returns plain, non-reactive ImageSetLayer
      }
    }
    return null;
  }

  function getPlaceImagesetOrder(place: Place) {
    const layer = getPlaceImageSetLayer(place);
    if (!layer) {
      return null;
    }
    return getImageSetLayerOrder(layer.id.toString());
  }

  function setPlaceImagesetOrder(place: Place, order: number) {
    const layer = getPlaceImageSetLayer(place);
    if (!layer) {
      return;
    }
    setImagesetLayerOrder(layer.id.toString(), order);
  }
  
  
  function setOrderForLayers(layers: ImageSetLayer[]) {
    const currentOrders = layers.map(layer => getImageSetLayerOrder(layer.id.toString()));
    let min = currentOrders.reduce((pre, curr, index) => {
      return Math.min(pre ?? Infinity, curr ?? Infinity);
    }, Infinity);
    min = min ?? 0;
    const newOrder = Array(layers.length).fill(0).map((_, index) => min + index);
    layers.forEach((layer, index) => setImagesetLayerOrder(layer.id.toString(), newOrder[index]));
  }
  
  function getOrderForLayers(layers: ImageSetLayer[]) {
    return layers.map(layer => getImageSetLayerOrder(layer.id.toString()));
  }
  
  function getOrderForPlaces(places: Place[]) {
    const layers = places.map(place => getPlaceImageSetLayer(place)).filter((layer) => layer !== null);
    return getOrderForLayers(layers);
  }
  
  function setOrderForPlaces(places: Place[]) {
    const layers = places.map(place => getPlaceImageSetLayer(place)).filter((layer) => layer !== null);
    setOrderForLayers(layers);
  }
  
  return {
    setOrderForLayers,
    setPlaceImagesetOrder,
    getPlaceImageSetLayer,
    setOrderForPlaces,
    getOrderForLayers,
    getOrderForPlaces,
  };
};