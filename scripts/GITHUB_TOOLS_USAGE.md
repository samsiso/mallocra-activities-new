# GitHub Tools Usage Guide

This guide explains how to use the custom GitHub tools in this repository to manage issues, milestones, and other GitHub features.

## Prerequisites

1. Python 3.6+ installed
2. `requests` Python package: `python -m pip install requests`
3. GitHub Personal Access Token with `repo` scope
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
   - Grant the `repo` scope
   - Copy the token (you'll only see it once)

## Available Tools

### Milestone Management

#### Creating Milestones

The `create_milestones_interactive.py` script allows you to create predefined or custom milestones.

```bash
python scripts/create_milestones_interactive.py
```

The script will:
1. Ask for repository owner and name (defaults to samsiso/mallocra-activities)
2. Securely prompt for your GitHub token
3. Show a list of predefined milestones:
   - Landing Page v1 (Due: 2025-07-15)
   - Activities Page v1 (Due: 2025-08-01)
   - Activities Detail Page v1 (Due: 2025-08-15)
   - Booking Flow v1 (Due: 2025-09-01)
   - MVP Release (Due: 2025-10-01)
4. Let you choose to:
   - Create all predefined milestones
   - Select specific milestones to create
   - Create a custom milestone
   - Quit

#### Assigning Issues to Milestones

The `assign_issues_interactive.py` script helps you assign issues to milestones.

```bash
python scripts/assign_issues_interactive.py
```

The script will:
1. Ask for repository owner and name (defaults to samsiso/mallocra-activities)
2. Securely prompt for your GitHub token
3. Fetch and display all available milestones
4. Ask you to select a milestone
5. Fetch all issues and display those not assigned to the selected milestone
6. Let you choose to:
   - Assign all unassigned issues to the selected milestone
   - Select specific issues to assign
   - Quit

## Security Notes

- These scripts use the `getpass` module to securely collect your GitHub token without displaying it
- Your token is only used during script execution and is not stored anywhere
- Always keep your GitHub token secure and never commit it to your repository
- Consider using environment variables for scripts in production environments

## Troubleshooting

- If you encounter "Bad credentials" errors, your token may be invalid or expired
- If you see "Not Found" errors, check that the repository owner and name are correct
- For other API errors, the script will display the error message from the GitHub API

## Additional Resources

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) 