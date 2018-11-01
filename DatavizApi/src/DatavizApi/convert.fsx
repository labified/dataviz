#I "C:/Users/andre/.nuget/packages"
#r "fsharp.data/3.0.0/lib/netstandard2.0/FSharp.Data.dll"

open FSharp.Data
open System

type TripCsv = CsvProvider<"../../data/train_sample.csv">

let data = TripCsv.GetSample().Rows |> Seq.head |> (fun r -> printfn "%s" (r.ToString()))


data
|> Array.sortBy (fun r -> r.pickup_datetime, r.id.[2..] |> int)
|> Seq.mapi (fun i r -> (i, r))
