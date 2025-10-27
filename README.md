# Perspective Reference Tool

A simple React app for perspective drawing reference with cubes and cylinders.

## Features

- **Two tabs**: Cubes and Cylinders
- **Perspective rotation**: View objects from different angles
- **Show/hide options**: Toggle non-viewing lines and vanishing points
- **Face coloring**: Customize the color of object faces
- **Random perspective**: Press Tab to generate random perspective
- **PNG download**: Save perspective images
- **Drawing notes**: Basic tips for perspective drawing

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment to GitHub Pages

1. Update the `homepage` field in `package.json` with your GitHub username:
```json
"homepage": "https://yourusername.github.io/refspace"
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

## Usage

- Switch between **Cubes** and **Cylinders** tabs
- Use checkboxes to show/hide non-viewing lines and vanishing points
- Change face color with the color picker
- Press **Tab** key to generate random perspective
- Click **Download PNG** to save the current view
- Refer to the drawing notes for perspective drawing tips

## Simple Design

The app follows a minimal design approach similar to [emj.is](https://www.emj.is/), focusing on functionality over complex UI elements.