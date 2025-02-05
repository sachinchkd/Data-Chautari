declare module 'topojson-client' {
    const value: any;
    export default value;
    export function feature(
      topology: any,
      object: any
    ): GeoJSON.FeatureCollection;
    export function mesh(
      topology: any,
      object: any,
      filter?: (a: any, b: any) => boolean
    ): GeoJSON.FeatureCollection;
  }