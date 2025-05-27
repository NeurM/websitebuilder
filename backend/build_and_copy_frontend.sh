#!/bin/bash

# Navigate to the project root (one level up from backend)
cd "$(dirname "$0")/.."

# Build the React app
npm run build

# Copy the build output to the Django static directory
cp -r dist/* backend/frontend_static/

echo "React app built and copied to backend/frontend_static/ successfully." 