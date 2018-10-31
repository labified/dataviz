IF NOT EXIST paket.lock (
    START /WAIT .paket/paket.exe install
)
dotnet restore src/dataviz_api
dotnet build src/dataviz_api

