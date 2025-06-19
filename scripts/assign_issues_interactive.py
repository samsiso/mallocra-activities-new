#!/usr/bin/env python3
"""
Interactive script to assign GitHub issues to milestones.
Usage: python scripts/assign_issues_interactive.py
"""

import sys
import requests
import json
import getpass

def get_milestones(token, repo_owner, repo_name):
    """Get all milestones from a repository."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/milestones"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"❌ Failed to get milestones.")
        print(f"Error: {response.text}")
        return []

def get_issues(token, repo_owner, repo_name):
    """Get all issues from a repository."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
    }
    
    # Get all issues, including those with no milestone
    params = {
        "state": "open",
        "per_page": 100
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        # Filter out pull requests (they're also returned by the issues endpoint)
        return [issue for issue in response.json() if "pull_request" not in issue]
    else:
        print(f"❌ Failed to get issues.")
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
        print(f"❌ Failed to assign issue #{issue_number} to milestone #{milestone_number}.")
        print(f"Error: {response.text}")
        return False

def main():
    repo_owner = input("Enter GitHub repository owner (default: samsiso): ") or "samsiso"
    repo_name = input("Enter GitHub repository name (default: mallocra-activities): ") or "mallocra-activities"
    
    # Get GitHub token securely
    token = getpass.getpass("Enter your GitHub personal access token (with 'repo' scope): ")
    
    if not token:
        print("Error: GitHub token is required.")
        sys.exit(1)
    
    # Get milestones
    print("\nFetching milestones...")
    milestones = get_milestones(token, repo_owner, repo_name)
    
    if not milestones:
        print("No milestones found or error occurred.")
        sys.exit(1)
    
    print("\nAvailable milestones:")
    for i, milestone in enumerate(milestones, 1):
        print(f"{i}. {milestone['title']} (#{milestone['number']})")
    
    # Select milestone
    milestone_idx = int(input("\nSelect milestone number (from the list above): ")) - 1
    
    if milestone_idx < 0 or milestone_idx >= len(milestones):
        print("Invalid milestone selection.")
        sys.exit(1)
    
    selected_milestone = milestones[milestone_idx]
    
    # Get issues
    print("\nFetching issues...")
    issues = get_issues(token, repo_owner, repo_name)
    
    if not issues:
        print("No issues found or error occurred.")
        sys.exit(1)
    
    # Filter issues that don't have the selected milestone
    unassigned_issues = [issue for issue in issues if not issue.get("milestone") or issue["milestone"]["number"] != selected_milestone["number"]]
    
    if not unassigned_issues:
        print(f"All open issues are already assigned to milestone '{selected_milestone['title']}'.")
        sys.exit(0)
    
    print(f"\nIssues not assigned to milestone '{selected_milestone['title']}':")
    for i, issue in enumerate(unassigned_issues, 1):
        milestone_info = f"({issue['milestone']['title']})" if issue.get("milestone") else "(No milestone)"
        print(f"{i}. #{issue['number']} - {issue['title']} {milestone_info}")
    
    print("\nOptions:")
    print("a - Assign all listed issues to the selected milestone")
    print("s - Select specific issues to assign")
    print("q - Quit")
    
    choice = input("\nEnter your choice: ").lower()
    
    if choice == 'a':
        # Assign all unassigned issues
        for issue in unassigned_issues:
            print(f"Assigning issue #{issue['number']} to milestone '{selected_milestone['title']}'...")
            if assign_issue_to_milestone(token, repo_owner, repo_name, issue["number"], selected_milestone["number"]):
                print(f"✅ Successfully assigned issue #{issue['number']} to milestone '{selected_milestone['title']}'")
    
    elif choice == 's':
        # Assign selected issues
        selections = input("Enter the numbers of the issues to assign (comma-separated): ")
        try:
            indices = [int(x.strip()) - 1 for x in selections.split(',')]
            for idx in indices:
                if 0 <= idx < len(unassigned_issues):
                    issue = unassigned_issues[idx]
                    print(f"Assigning issue #{issue['number']} to milestone '{selected_milestone['title']}'...")
                    if assign_issue_to_milestone(token, repo_owner, repo_name, issue["number"], selected_milestone["number"]):
                        print(f"✅ Successfully assigned issue #{issue['number']} to milestone '{selected_milestone['title']}'")
                else:
                    print(f"Invalid selection: {idx + 1}")
        except ValueError:
            print("Invalid input. Please enter comma-separated numbers.")
    
    elif choice == 'q':
        print("Exiting...")
    
    else:
        print("Invalid choice.")

if __name__ == "__main__":
    main() 