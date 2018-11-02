module DatavizApi.Data

open FSharp.Data
open System

type TripCsv = CsvProvider<"../../data/trips_sample.csv">

// type TripData = {
//   Id: string
//   PickupDateTime: DateTime
//   PickupLongitude: float
//   PickupLatitude: float
//   DropoffLongitude: float
//   DropoffLatitude: float
// }

// type Trip = {
//   RowId: int
//   Data: TripData
// }

let log msg =
  printfn "%A - %s" DateTime.Now msg

let init () =
  try
    log "Start reading data..."
    let data = TripCsv.Load("../../../../../data/trips_20k.csv").Rows |> Seq.toArray
    log "Done reading data"
    data
    // log "Start deserializing..."
    // let deserialized =
    //   data
    //   |> Seq.map (fun r -> {
    //     Id = r.Id
    //     PickupDateTime = r.Pickup_datetime
    //     PickupLongitude = r.Pickup_longitude
    //     PickupLatitude = r.Pickup_latitude
    //     DropoffLongitude = r.Dropoff_longitude
    //     DropoffLatitude = r.Dropoff_latitude
    //   })
    // log "Done deserializing"
    // log "Start sorting data..."
    // let sorted = 
    //   deserialized
    //   |> Seq.sortBy (fun t ->  t.PickupDateTime, t.Id.Substring(2) |> int)
    //   |> Seq.mapi (fun i t -> {RowId = i; Data = t})
    // log "Done sorting data"
    // log "Convert to array"
    // let array = sorted |> Seq.toArray
    // log "Done converting to array"
    // array
  with 
    | e -> log (e.ToString()); [||]

let allTrips = init()

let start () =
  allTrips.[..999]

let next lastRowId maxDateTime =
  allTrips.[lastRowId + 1..]
  |> Array.takeWhile (fun r -> r.Pickup_datetime <= maxDateTime)