#!/bin/bash

# Script to create GitHub milestones for the project
# Usage: ./create-milestones.sh <github_token>

if [ $# -ne 1 ]; then
  echo "Usage: ./create-milestones.sh <github_token>"
  exit 1
fi

TOKEN=$1
REPO_OWNER="samsiso"
REPO_NAME="mallocra-activities"
API_URL="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/milestones"

# Function to create a milestone
create_milestone() {
  title=$1
  description=$2
  due_date=$3
  
  if [ -z "$due_date" ]; then
    # Create milestone without due date
    json_data="{\"title\":\"$title\",\"description\":\"$description\",\"state\":\"open\"}"
  else
    # Create milestone with due date
    json_data="{\"title\":\"$title\",\"description\":\"$description\",\"due_on\":\"$due_date\",\"state\":\"open\"}"
  fi
  
  echo "Creating milestone: $title"
  
  response=$(curl -s -X POST $API_URL \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Authorization: token $TOKEN" \
    -d "$json_data")
  
  if echo "$response" | grep -q "number"; then
    echo "✅ Successfully created milestone: $title"
  else
    echo "❌ Failed to create milestone: $title"
    echo "Error: $response"
  fi
}

# Create milestones for the project
echo "Creating milestones for $REPO_OWNER/$REPO_NAME..."

# Landing Page Milestones
create_milestone "Landing Page v1" "Initial improvements to the landing page including search, map overlay fix, and navigation bar redesign" "2025-07-15T00:00:00Z"

# Activities Page Milestones
create_milestone "Activities Page v1" "Initial improvements to the activities listing page" "2025-08-01T00:00:00Z"

# Activities Detail Page Milestones
create_milestone "Activities Detail Page v1" "Initial improvements to the activities detail page" "2025-08-15T00:00:00Z"

# Booking Flow Milestones
create_milestone "Booking Flow v1" "Streamlined booking flow implementation" "2025-09-01T00:00:00Z"

# Overall Project Milestones
create_milestone "MVP Release" "Minimum viable product with all core functionality" "2025-10-01T00:00:00Z"

echo "Done creating milestones!" 