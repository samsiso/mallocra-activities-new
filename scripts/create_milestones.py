#!/usr/bin/env python3
"""
Script to create GitHub milestones for the project.
Usage: python scripts/create_milestones.py <github_token>
"""

import sys
import requests
import json
from datetime import datetime, timedelta

def create_milestone(token, repo_owner, repo_name, title, description, due_date=None):
    """Create a GitHub milestone."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/milestones"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
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

def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/create_milestones.py <github_token>")
        sys.exit(1)
    
    token = sys.argv[1]
    repo_owner = "samsiso"
    repo_name = "mallocra-activities"
    
    print(f"Creating milestones for {repo_owner}/{repo_name}...")
    
    # Define milestones
    milestones = [
        {
            "title": "Landing Page v1",
            "description": "Initial improvements to the landing page including search, map overlay fix, and navigation bar redesign",
            "due_date": "2025-07-15T00:00:00Z"
        },
        {
            "title": "Activities Page v1",
            "description": "Initial improvements to the activities listing page",
            "due_date": "2025-08-01T00:00:00Z"
        },
        {
            "title": "Activities Detail Page v1",
            "description": "Initial improvements to the activities detail page",
            "due_date": "2025-08-15T00:00:00Z"
        },
        {
            "title": "Booking Flow v1",
            "description": "Streamlined booking flow implementation",
            "due_date": "2025-09-01T00:00:00Z"
        },
        {
            "title": "MVP Release",
            "description": "Minimum viable product with all core functionality",
            "due_date": "2025-10-01T00:00:00Z"
        }
    ]
    
    # Create each milestone
    for milestone in milestones:
        create_milestone(
            token, 
            repo_owner, 
            repo_name, 
            milestone["title"], 
            milestone["description"], 
            milestone["due_date"]
        )
    
    print("Done creating milestones!")

if __name__ == "__main__":
    main() 