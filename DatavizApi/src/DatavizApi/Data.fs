module DatavizApi.Data

open FSharp.Data
open System

type CsvTrips = CsvProvider<"../../data/train.csv">

type TripData = {
  Id: string
  PickupDateTime: DateTime
  PickupLongitude: float
  PickupLatitude: float
  DropoffLongitude: float
  DropoffLatitude: float
}

type Trip = {
  RowId: int
  Data: TripData
}

let init () =

  CsvTrips.Load("../../train.csv").Rows
  |> Seq.map (fun r -> {
    Id = r.Id
    PickupDateTime = r.Pickup_datetime
    PickupLongitude = r.Pickup_longitude |> float
    PickupLatitude = r.Pickup_latitude |> float
    DropoffLongitude = r.Dropoff_longitude |> float
    DropoffLatitude = r.Dropoff_latitude |> float
  })
  |> Seq.sortBy (fun t ->  t.PickupDateTime, t.Id.Substring(2) |> int)
  |> Seq.mapi (fun i t -> {RowId = i; Data = t})
  |> Seq.toArray

let allTrips = init()

let start () =
  allTrips.[..1000]

let next lastRowId maxDateTime =
  allTrips.[lastRowId..]
  |> Array.takeWhile (fun {RowId = _; Data = t} -> t.PickupDateTime <= maxDateTime)