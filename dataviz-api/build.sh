if [ ! -e "paket.lock" ]
then
    exec mono .paket/paket.exe install
fi
dotnet restore src/dataviz_api
dotnet build src/dataviz_api

