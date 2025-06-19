#!/usr/bin/env python3
"""
Script to assign new issues to their appropriate milestones.
"""

import requests
import sys

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

# Issue to milestone mapping
ASSIGNMENTS = [
    # Activities Page v1 milestone (#2)
    (12, 2),  # Grid Layout Optimization
    (13, 2),  # Advanced Search and Filter
    
    # Activities Detail Page v1 milestone (#3)
    (14, 3),  # Enhanced Media Gallery
    (15, 3),  # Interactive Map Integration
    
    # Booking Flow v1 milestone (#4)
    (16, 4),  # Streamlined Booking Process
]

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
    print("Assigning issues to milestones...")
    
    for issue_number, milestone_number in ASSIGNMENTS:
        assign_issue_to_milestone(issue_number, milestone_number)
    
    print("\nAssignment complete!")

if __name__ == "__main__":
    main() 