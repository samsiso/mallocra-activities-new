#!/usr/bin/env python3
"""
Script to assign GitHub issues to milestones.
Usage: python scripts/assign_issues_to_milestones.py <github_token>
"""

import sys
import requests
import json

def get_milestones(token, repo_owner, repo_name):
    """Get all milestones for a repository."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/milestones?state=open"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return {milestone["title"]: milestone["number"] for milestone in response.json()}
    else:
        print(f"❌ Failed to get milestones")
        print(f"Error: {response.text}")
        return {}

def get_issues(token, repo_owner, repo_name, label=None):
    """Get all issues for a repository, optionally filtered by label."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues?state=open"
    if label:
        url += f"&labels={label}"
    
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        # Filter out pull requests
        return [issue for issue in response.json() if "pull_request" not in issue]
    else:
        print(f"❌ Failed to get issues")
        print(f"Error: {response.text}")
        return []

def assign_issue_to_milestone(token, repo_owner, repo_name, issue_number, milestone_number):
    """Assign an issue to a milestone."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues/{issue_number}"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
    }
    data = {
        "milestone": milestone_number
    }
    
    response = requests.patch(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return True
    else:
        print(f"❌ Failed to assign issue #{issue_number} to milestone #{milestone_number}")
        print(f"Error: {response.text}")
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/assign_issues_to_milestones.py <github_token>")
        sys.exit(1)
    
    token = sys.argv[1]
    repo_owner = "samsiso"
    repo_name = "mallocra-activities"
    
    # Get all milestones
    milestones = get_milestones(token, repo_owner, repo_name)
    if not milestones:
        print("No milestones found. Please create milestones first.")
        sys.exit(1)
    
    print(f"Found {len(milestones)} milestones:")
    for title, number in milestones.items():
        print(f"  - {title} (#{number})")
    
    # Define issue assignments
    assignments = {
        "Landing Page v1": [
            {"label": "landing-page", "priority": "high-priority"},
            {"issue_numbers": [1, 4, 5, 10]} # Search, Map, Navigation, Mobile
        ],
        "Activities Page v1": [
            {"label": "activities-page"},
            {"issue_numbers": []} # No issues yet
        ],
        "Activities Detail Page v1": [
            {"label": "detail-page"},
            {"issue_numbers": []} # No issues yet
        ],
        "MVP Release": [
            {"label": "landing-page", "priority": "medium-priority"},
            {"issue_numbers": [2, 7, 8, 9]} # Activities cards, Refactoring, Performance, Accessibility
        ]
    }
    
    # Assign issues to milestones
    for milestone_title, assignment_rules in assignments.items():
        if milestone_title not in milestones:
            print(f"Milestone '{milestone_title}' not found. Skipping.")
            continue
        
        milestone_number = milestones[milestone_title]
        print(f"\nAssigning issues to milestone '{milestone_title}' (#{milestone_number}):")
        
        # Assign issues by label
        for rule in assignment_rules:
            if "label" in rule:
                label = rule["label"]
                priority = rule.get("priority")
                label_query = label
                if priority:
                    label_query = f"{label},{priority}"
                
                issues = get_issues(token, repo_owner, repo_name, label_query)
                
                for issue in issues:
                    issue_number = issue["number"]
                    print(f"  - Assigning issue #{issue_number} ({issue['title']}) to milestone '{milestone_title}'")
                    assign_issue_to_milestone(token, repo_owner, repo_name, issue_number, milestone_number)
            
            # Assign specific issues by number
            if "issue_numbers" in rule:
                for issue_number in rule["issue_numbers"]:
                    print(f"  - Assigning issue #{issue_number} to milestone '{milestone_title}'")
                    assign_issue_to_milestone(token, repo_owner, repo_name, issue_number, milestone_number)
    
    print("\nDone assigning issues to milestones!")

if __name__ == "__main__":
    main() 