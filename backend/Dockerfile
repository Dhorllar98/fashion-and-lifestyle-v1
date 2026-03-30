# ── Build stage ────────────────────────────────────────────────────────────────
# Build context is the repo root, so all paths are prefixed with backend/
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["backend/FashionLifestyle.API.csproj", "backend/"]
RUN dotnet restore "backend/FashionLifestyle.API.csproj"
COPY backend/ backend/
WORKDIR /src/backend
RUN dotnet publish "FashionLifestyle.API.csproj" -c Release -o /app/publish

# ── Runtime stage ──────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FashionLifestyle.API.dll"]
