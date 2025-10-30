
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/*.csproj backend/
RUN dotnet restore "backend/TaskManager.Api.csproj"


COPY . .
WORKDIR "/src/backend"
RUN dotnet publish "TaskManager.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .


ENV ASPNETCORE_URLS=http://*:80


ENTRYPOINT ["dotnet", "TaskManager.Api.dll"]