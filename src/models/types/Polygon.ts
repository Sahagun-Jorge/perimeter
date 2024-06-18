import { Polygon as GeoJsonPolygon, Feature, GeoJsonProperties } from "geojson";

export type Polygon = Feature<GeoJsonPolygon, GeoJsonProperties>;
