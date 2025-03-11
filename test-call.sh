#!/bin/bash
  
  # Load the environment variables
  source .env
  
  # Make the curl request - note no trailing backslashes with line breaks
  curl -X POST "localhost:5001/shiftr-webhook" \
    -H "X-API-Key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "lat": 53.554551,
      "lon": 9.962152,
      "alt": 10,
      "quality": "good",
      "time": "2025-03-10T10:00:00Z"
    }'