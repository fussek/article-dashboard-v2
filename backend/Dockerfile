# Stage 1: Build the application
# Use the official .NET 6 SDK image to build our app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy the project file and restore dependencies
COPY *.csproj .
RUN dotnet restore

# Copy the rest of the source code
COPY . .

# Publish the application to a 'publish' folder
RUN dotnet publish -c Release -o out


# Stage 2: Create the final runtime image
# Use the smaller ASP.NET runtime image for the final product
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/out .

# The entry point for the container - this runs your app
ENTRYPOINT ["dotnet", "backend.dll"]
