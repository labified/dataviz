module DatavizApi.GeoJSONData

open GeoJSON.Net.Feature
open GeoJSON.Net.Geometry
open System.Collections.Generic

let dictionary (values: (string * string) seq) =
  let d = Dictionary<string, string>()
  values
  |> Seq.iter (fun (name, value) -> d.Add(name, value))
  d

let toGeoJSON (trip : Data.TripCsv.Row) =
  [|
    Feature(
      Point(Position(trip.Pickup_longitude, trip.Pickup_latitude)), 
      dictionary ["category", "pickup"; "rowId", trip.Row_id.ToString()], 
      trip.Id)
    Feature(
      Point(Position(trip.Dropoff_longitude, trip.Dropoff_latitude)), 
      dictionary ["category", "dropoff"; "rowId", trip.Row_id.ToString()], 
      trip.Id)
  |]

let start () =
  Data.start () |> Array.collect toGeoJSON

let next lastRowId maxDateTime =
  Data.next lastRowId maxDateTime |> Array.collect toGeoJSON