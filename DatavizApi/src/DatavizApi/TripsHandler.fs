module DatavizApi.TripsHandler
open Giraffe.ResponseWriters
open System

let start () =
  GeoJSONData.start () |> json

let next (lastRowId, (maxDateTime : string)) =
  match DateTime.TryParse(maxDateTime) with
  | (false, _) -> raise (ArgumentException(sprintf "%s is not a valid DateTime" maxDateTime))
  | (true, dt) -> GeoJSONData.next lastRowId dt |> json