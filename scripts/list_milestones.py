#!/usr/bin/env python3
"""
Script to list GitHub milestones for the project.
Usage: python scripts/list_milestones.py <github_token>
"""

import sys
import requests
import json
from datetime import datetime

def list_milestones(token, repo_owner, repo_name, state="open"):
    """List GitHub milestones."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/milestones?state={state}"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
    }
    
    print(f"Listing {state} milestones for {repo_owner}/{repo_name}...")
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        milestones = response.json()
        
        if not milestones:
            print(f"No {state} milestones found.")
            return []
        
        print(f"Found {len(milestones)} {state} milestones:")
        for milestone in milestones:
            print(f"\n📊 {milestone['title']} (#{milestone['number']})")
            print(f"   Description: {milestone['description']}")
            print(f"   State: {milestone['state']}")
            
            if milestone['due_on']:
                due_date = datetime.fromisoformat(milestone['due_on'].replace('Z', '+00:00'))
                print(f"   Due: {due_date.strftime('%Y-%m-%d')}")
            else:
                print("   Due: No due date")
                
            print(f"   Open issues: {milestone['open_issues']}")
            print(f"   Closed issues: {milestone['closed_issues']}")
            
        return milestones
    else:
        print(f"❌ Failed to list milestones")
        print(f"Error: {response.text}")
        return None

def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/list_milestones.py <github_token>")
        sys.exit(1)
    
    token = sys.argv[1]
    repo_owner = "samsiso"
    repo_name = "mallocra-activities"
    
    # List open milestones
    open_milestones = list_milestones(token, repo_owner, repo_name, "open")
    
    # Uncomment to also list closed milestones
    # closed_milestones = list_milestones(token, repo_owner, repo_name, "closed")

if __name__ == "__main__":
    main() 