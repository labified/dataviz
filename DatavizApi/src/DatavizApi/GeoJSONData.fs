module DatavizApi.GeoJSONData

open Data
open GeoJSON.Net.Feature
open GeoJSON.Net.Geometry

let category value =
  dict [("category", value)]

let toGeoJSON ({RowId = i; Data = trip}) =
  [|
    Feature(Point(Position(trip.PickupLongitude, trip.PickupLatitude)), category "pickup", trip.Id)
    Feature(Point(Position(trip.DropoffLongitude, trip.DropoffLatitude)), category "dropoff", trip.Id)
  |]

let start () =
  Data.start () |> Array.collect toGeoJSON

let next lastRowId maxDateTime =
  Data.next lastRowId maxDateTime |> Array.collect toGeoJSON