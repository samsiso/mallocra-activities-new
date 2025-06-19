#!/usr/bin/env python3
"""
Interactive script to create GitHub milestones for the project.
Usage: python scripts/create_milestones_interactive.py
"""

import sys
import requests
import json
import getpass
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
    repo_owner = input("Enter GitHub repository owner (default: samsiso): ") or "samsiso"
    repo_name = input("Enter GitHub repository name (default: mallocra-activities): ") or "mallocra-activities"
    
    # Get GitHub token securely
    token = getpass.getpass("Enter your GitHub personal access token (with 'repo' scope): ")
    
    if not token:
        print("Error: GitHub token is required.")
        sys.exit(1)
    
    # Define predefined milestones
    predefined_milestones = [
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
    
    print("\nPredefined milestones:")
    for i, milestone in enumerate(predefined_milestones, 1):
        print(f"{i}. {milestone['title']} (Due: {milestone['due_date'].split('T')[0]})")
    
    print("\nOptions:")
    print("a - Create all predefined milestones")
    print("s - Select specific milestones to create")
    print("c - Create a custom milestone")
    print("q - Quit")
    
    choice = input("\nEnter your choice: ").lower()
    
    if choice == 'a':
        # Create all predefined milestones
        for milestone in predefined_milestones:
            create_milestone(token, repo_owner, repo_name, milestone["title"], milestone["description"], milestone["due_date"])
    
    elif choice == 's':
        # Create selected milestones
        selections = input("Enter the numbers of the milestones to create (comma-separated): ")
        try:
            indices = [int(x.strip()) - 1 for x in selections.split(',')]
            for idx in indices:
                if 0 <= idx < len(predefined_milestones):
                    milestone = predefined_milestones[idx]
                    create_milestone(token, repo_owner, repo_name, milestone["title"], milestone["description"], milestone["due_date"])
                else:
                    print(f"Invalid selection: {idx + 1}")
        except ValueError:
            print("Invalid input. Please enter comma-separated numbers.")
    
    elif choice == 'c':
        # Create a custom milestone
        title = input("Enter milestone title: ")
        description = input("Enter milestone description: ")
        due_date_str = input("Enter due date (YYYY-MM-DD), leave empty for no due date: ")
        
        due_date = None
        if due_date_str:
            try:
                due_date = f"{due_date_str}T00:00:00Z"
            except ValueError:
                print("Invalid date format. Using no due date.")
        
        if title:
            create_milestone(token, repo_owner, repo_name, title, description, due_date)
        else:
            print("Milestone title is required.")
    
    elif choice == 'q':
        print("Exiting...")
    
    else:
        print("Invalid choice.")

if __name__ == "__main__":
    main() 