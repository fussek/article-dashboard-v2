#!/bin/bash
echo "Starting Backend API..."
(cd backend && dotnet run) &

echo "Starting Frontend App..."
(cd frontend && ng serve)