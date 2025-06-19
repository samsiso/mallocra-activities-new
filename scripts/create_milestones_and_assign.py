#!/usr/bin/env python3
"""
Script to create GitHub milestones and assign issues.
This script reads a token from a file for security.
"""

import sys
import requests
import json
import os

# Configuration
REPO_OWNER = "samsiso"
REPO_NAME = "mallocra-activities"
TOKEN_FILE = "scripts/github_token.txt"

# Read token from file
try:
    with open(TOKEN_FILE, "r") as f:
        TOKEN = f.read().strip()
except Exception as e:
    print(f"Error reading token file: {e}")
    sys.exit(1)

# Milestone definitions
MILESTONES = [
    {
        "title": "Landing Page v1",
        "description": "Initial improvements to the landing page including search, map overlay fix, and navigation bar redesign",
        "due_on": "2025-07-15T00:00:00Z",
        "issue_ids": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]  # All landing page issues
    },
    {
        "title": "Activities Page v1",
        "description": "Initial improvements to the activities listing page",
        "due_on": "2025-08-01T00:00:00Z",
        "issue_ids": []  # Will be assigned later when issues are created
    },
    {
        "title": "Activities Detail Page v1",
        "description": "Initial improvements to the activities detail page",
        "due_on": "2025-08-15T00:00:00Z",
        "issue_ids": []  # Will be assigned later when issues are created
    },
    {
        "title": "Booking Flow v1",
        "description": "Streamlined booking flow implementation",
        "due_on": "2025-09-01T00:00:00Z",
        "issue_ids": []  # Will be assigned later when issues are created
    },
    {
        "title": "MVP Release",
        "description": "Minimum viable product with all core functionality",
        "due_on": "2025-10-01T00:00:00Z",
        "issue_ids": []  # This will be a parent milestone for tracking overall progress
    }
]

def create_milestone(title, description, due_date=None):
    """Create a GitHub milestone."""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/milestones"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {TOKEN}"
    }
    
    data = {
        "title": title,
        "description": description,
        "state": "open"
    }
    
    if due_date:
        data["due_on"] = due_date
    
    print(f"Creating milestone: {title}")
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 201:
        print(f"✅ Successfully created milestone: {title}")
        return response.json()
    else:
        print(f"❌ Failed to create milestone: {title}")
        print(f"Error: {response.text}")
        return None

def get_milestones():
    """Get all milestones from the repository."""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/milestones"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {TOKEN}"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"❌ Failed to get milestones.")
        print(f"Error: {response.text}")
        return []

def assign_issue_to_milestone(issue_number, milestone_number):
    """Assign an issue to a milestone."""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/issues/{issue_number}"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {TOKEN}"
    }
    
    data = {
        "milestone": milestone_number
    }
    
    response = requests.patch(url, headers=headers, json=data)
    
    if response.status_code == 200:
        print(f"✅ Successfully assigned issue #{issue_number} to milestone #{milestone_number}")
        return True
    else:
        print(f"❌ Failed to assign issue #{issue_number} to milestone #{milestone_number}.")
        print(f"Error: {response.text}")
        return False

def main():
    print("Creating milestones and assigning issues...")
    
    # Check if milestones already exist
    existing_milestones = get_milestones()
    existing_milestone_titles = [m["title"] for m in existing_milestones]
    
    # Create milestones if they don't exist
    milestone_map = {}  # Maps milestone titles to numbers
    
    for existing in existing_milestones:
        milestone_map[existing["title"]] = existing["number"]
    
    for milestone in MILESTONES:
        if milestone["title"] not in existing_milestone_titles:
            result = create_milestone(
                milestone["title"], 
                milestone["description"], 
                milestone["due_on"]
            )
            
            if result:
                milestone_map[milestone["title"]] = result["number"]
        else:
            print(f"Milestone '{milestone['title']}' already exists.")
    
    # Assign issues to milestones
    for milestone in MILESTONES:
        if milestone["title"] in milestone_map and milestone["issue_ids"]:
            milestone_number = milestone_map[milestone["title"]]
            
            for issue_id in milestone["issue_ids"]:
                assign_issue_to_milestone(issue_id, milestone_number)
    
    print("\nSummary of milestones:")
    for title, number in milestone_map.items():
        print(f"- {title}: #{number}")

    # Delete token file for security
    try:
        os.remove(TOKEN_FILE)
        print(f"\nToken file '{TOKEN_FILE}' has been deleted for security.")
    except Exception as e:
        print(f"\nWarning: Could not delete token file: {e}")

if __name__ == "__main__":
    main() 