/**
 * Script to create GitHub issues from the landing page backlog
 * 
 * Prerequisites:
 * 1. Install GitHub CLI: https://cli.github.com/
 * 2. Authenticate: Run `gh auth login`
 * 3. Install Node.js dependencies: `npm install fs marked`
 * 
 * Usage:
 * node scripts/create-github-issues.js
 */

const fs = require('fs');
const { execSync } = require('child_process');
const { marked } = require('marked');

// Configuration
const BACKLOG_FILE = 'docs/landing-page-backlog.md';
const REPO = 'your-username/your-repo-name'; // Replace with your GitHub username and repo

// Read the backlog file
const backlogContent = fs.readFileSync(BACKLOG_FILE, 'utf8');

// Parse markdown into tokens
const tokens = marked.lexer(backlogContent);

// Process the tokens to extract sections and tasks
const sections = [];
let currentSection = null;

tokens.forEach(token => {
  if (token.type === 'heading' && token.depth === 2) {
    // This is a section heading (##)
    currentSection = {
      title: token.text,
      tasks: []
    };
    sections.push(currentSection);
  } else if (token.type === 'list' && currentSection) {
    // This is a list of tasks
    token.items.forEach(item => {
      if (item.text && !item.text.startsWith('[ ]')) return;
      
      // Extract the task text (remove the checkbox)
      const taskText = item.text.replace(/\[\s?\]\s/, '');
      
      // Check if this task has subtasks
      let description = '';
      if (item.tokens && item.tokens.some(t => t.type === 'list')) {
        const subtasksList = item.tokens.find(t => t.type === 'list');
        if (subtasksList && subtasksList.items) {
          description = "### Subtasks:\n\n";
          subtasksList.items.forEach(subtask => {
            const subtaskText = subtask.text.replace(/\[\s?\]\s/, '');
            description += `- [ ] ${subtaskText}\n`;
          });
        }
      }
      
      currentSection.tasks.push({
        title: taskText,
        description: description
      });
    });
  }
});

// Create GitHub issues
console.log('Creating GitHub issues...');

sections.forEach(section => {
  console.log(`\nSection: ${section.title}`);
  
  section.tasks.forEach(task => {
    const title = `[Landing Page] ${task.title}`;
    const body = `Part of the Landing Page improvements.\n\n${task.description}`;
    const label = `area: ${section.title.toLowerCase()}`;
    
    try {
      // Create a temporary file for the issue body
      const tempFile = `temp-issue-${Date.now()}.md`;
      fs.writeFileSync(tempFile, body);
      
      // Create the issue using GitHub CLI
      const command = `gh issue create --repo ${REPO} --title "${title}" --body-file ${tempFile} --label "landing-page,${label}"`;
      console.log(`Creating issue: ${title}`);
      
      // Uncomment this line to actually create the issues
      // execSync(command, { stdio: 'inherit' });
      
      // Remove the temporary file
      fs.unlinkSync(tempFile);
    } catch (error) {
      console.error(`Error creating issue "${title}":`, error.message);
    }
  });
});

console.log('\nTo actually create the issues:');
console.log('1. Install GitHub CLI: https://cli.github.com/');
console.log('2. Authenticate with GitHub: run `gh auth login`');
console.log('3. Install required Node.js packages: `npm install marked`');
console.log('4. Update the REPO variable in the script with your GitHub username/repo');
console.log('5. Uncomment the execSync line in the script');
console.log('6. Run: node scripts/create-github-issues.js'); 