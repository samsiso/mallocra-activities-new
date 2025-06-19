#!/usr/bin/env python3
"""
Create GitHub issues from the landing page backlog.

Prerequisites:
1. Install dependencies: pip install requests markdown
2. Create a GitHub Personal Access Token with 'repo' scope
   at https://github.com/settings/tokens

Usage:
export GITHUB_TOKEN=your_token_here
python scripts/github_issues.py
"""

import os
import re
import requests
import markdown
from bs4 import BeautifulSoup

# Configuration
REPO_OWNER = "your-username"  # Replace with your GitHub username
REPO_NAME = "your-repo-name"  # Replace with your repository name
BACKLOG_FILE = "docs/landing-page-backlog.md"
GITHUB_API = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/issues"

# Read GitHub token from environment variable
token = os.environ.get("GITHUB_TOKEN")
if not token:
    print("Error: GITHUB_TOKEN environment variable not set.")
    print("Create a token at https://github.com/settings/tokens and set it with:")
    print("export GITHUB_TOKEN=your_token_here")
    exit(1)

# Read backlog file
with open(BACKLOG_FILE, "r") as file:
    backlog_content = file.read()

# Parse the markdown to extract sections and tasks
sections = []
current_section = None
tasks = []

# Split content into lines
lines = backlog_content.split("\n")
i = 0

while i < len(lines):
    line = lines[i].strip()
    
    # Section headers (##)
    if line.startswith("## "):
        if current_section and tasks:
            sections.append({
                "title": current_section,
                "tasks": tasks
            })
            tasks = []
        
        current_section = line[3:]
    
    # Task items (- [ ])
    elif line.startswith("- [ ]"):
        task_title = line[6:].strip()
        task_description = ""
        subtasks = []
        
        # Look ahead for subtasks
        j = i + 1
        while j < len(lines) and lines[j].strip().startswith("  - [ ]"):
            subtask = lines[j].strip()[8:]
            subtasks.append(subtask)
            j += 1
        
        if subtasks:
            task_description = "### Subtasks:\n\n" + "\n".join([f"- [ ] {task}" for task in subtasks])
            i = j - 1
        
        tasks.append({
            "title": task_title,
            "description": task_description
        })
    
    i += 1

# Add the last section
if current_section and tasks:
    sections.append({
        "title": current_section,
        "tasks": tasks
    })

# Create issues on GitHub
headers = {
    "Authorization": f"token {token}",
    "Accept": "application/vnd.github.v3+json"
}

print("Creating GitHub issues...")

# Uncomment the following to actually create issues
create_issues = False  # Set to True to create issues

for section in sections:
    print(f"\nSection: {section['title']}")
    
    for task in section['tasks']:
        issue_title = f"[Landing Page] {task['title']}"
        issue_body = f"Part of the Landing Page improvements.\n\n{task['description']}"
        labels = ["landing-page", f"area: {section['title'].lower()}"]
        
        issue_data = {
            "title": issue_title,
            "body": issue_body,
            "labels": labels
        }
        
        print(f"Creating issue: {issue_title}")
        
        if create_issues:
            response = requests.post(GITHUB_API, json=issue_data, headers=headers)
            if response.status_code == 201:
                print(f"  ✓ Created issue #{response.json()['number']}")
            else:
                print(f"  ✗ Failed to create issue: {response.status_code}")
                print(response.json())
        else:
            print("  (Dry run - not actually creating issue)")

print("\nTo actually create the issues:")
print("1. Set GITHUB_TOKEN environment variable")
print("2. Update REPO_OWNER and REPO_NAME in the script")
print("3. Set create_issues = True in the script")
print("4. Run: python scripts/github_issues.py") 