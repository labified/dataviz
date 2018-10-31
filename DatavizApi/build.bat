IF NOT EXIST paket.lock (
    START /WAIT .paket/paket.exe install
)
dotnet restore src/DatavizApi
dotnet build src/DatavizApi

