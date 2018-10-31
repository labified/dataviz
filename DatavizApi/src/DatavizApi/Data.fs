module DatavizApi.Data

open FSharp.Data
open System

type CsvTrips = CsvProvider<"../../data/train_sample.csv">

type TripData = {
  Id: int
  PickupDateTime: DateTime
  PickupLongitude: decimal
  PickupLatitude: decimal
  DropoffLongitude: decimal
  DropoffLatitude: decimal
}

type Trip = {
  RowId: int
  Data: TripData
}

let init () =

  CsvTrips.Load("../../train.csv").Rows
  |> Seq.map (fun r -> {
    Id = r.Id.Substring(2) |> int
    PickupDateTime = r.Pickup_datetime
    PickupLongitude = r.Pickup_longitude
    PickupLatitude = r.Pickup_latitude
    DropoffLongitude = r.Dropoff_longitude
    DropoffLatitude = r.Dropoff_latitude
  })
  |> Seq.sortBy (fun t ->  t.PickupDateTime, t.Id)
  |> Seq.mapi (fun i t -> {RowId = i; Data = t})
  |> Seq.toArray

let allTrips = init()

let start () =
  allTrips.[..1000]

let next lastRowId maxDateTime =
  allTrips.[lastRowId..]
  |> Array.takeWhile (fun {RowId = _; Data = t} -> t.PickupDateTime <= maxDateTime)