
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src


COPY *.csproj .
RUN dotnet restore "TaskManager.Api.csproj"


COPY . .
RUN dotnet publish "TaskManager.Api.csproj" -c Release -o /app/publish


FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .


ENV ASPNETCORE_URLS=http://*:80


ENTRYPOINT ["dotnet", "TaskManager.Api.dll"]

