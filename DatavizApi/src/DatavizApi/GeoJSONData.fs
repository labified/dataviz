module DatavizApi.GeoJSONData

open GeoJSON.Net.Feature
open GeoJSON.Net.Geometry
open System.Collections.Generic

let dictionary (values: (string * string) list) =
  let d = Dictionary<string, obj>()
  values
  |> List.iter (fun (name, value) -> d.Add(name, value))
  d

let toGeoJSON (trip : Data.TripCsv.Row) =
  [|
    Feature(
      Point(Position(trip.Pickup_latitude, trip.Pickup_longitude)), 
      dictionary ["category", "pickup"; "rowId", trip.Row_id.ToString(); "datetime", trip.Pickup_datetime.ToString()], 
      trip.Id)
    Feature(
      Point(Position(trip.Dropoff_latitude, trip.Dropoff_longitude)), 
      dictionary ["category", "dropoff"; "rowId", trip.Row_id.ToString(); "datetime", trip.Pickup_datetime.ToString()], 
      trip.Id)
  |]

let start () =
  Data.start () |> Array.collect toGeoJSON

let next lastRowId maxDateTime =
  Data.next lastRowId maxDateTime |> Array.collect toGeoJSON