// Learn more about F# at http://fsharp.org

open System
open FSharp.Data
open System.IO
open System

type TripsCsv = CsvProvider<"../../data/train_sample.csv">

[<EntryPoint>]
let main _ =
  let tripsCsv = TripsCsv.Load("C:/Users/andre/source/nyc-taxi-trip-duration/data/train.csv")
  
  let sorted =
    tripsCsv.Rows
    |> Seq.sortBy (fun r -> r.Pickup_datetime)
    |> Seq.mapi (fun i r -> sprintf "%i,%s,%i,%O,%O,%i,%f,%f,%f,%f,%s,%i" i r.Id r.Vendor_id r.Pickup_datetime r.Dropoff_datetime r.Passenger_count r.Pickup_longitude r.Pickup_latitude r.Dropoff_longitude r.Dropoff_latitude r.Store_and_fwd_flag r.Trip_duration)

  let headers = "row_id,id,vendor_id,pickup_datetime,dropoff_datetime,passenger_count,pickup_longitude,pickup_latitude,dropoff_longitude,dropoff_latitude,store_and_fwd_flag,trip_duration"

  File.WriteAllLines("../../data/trips.csv", sorted |> Seq.append (Seq.singleton headers))
  0
