# Airtightness Report

A modern web application for generating ISO 9972:2015 compliant airtightness test reports. Built for building professionals, energy consultants, and Passive House certifiers.

## Why Use This?

- **No more spreadsheets** — Replace clunky Excel templates with a clean, purpose-built interface
- **Instant calculations** — n50, V50, and qE50 values calculated automatically from your measurement data
- **Local storage** — Reports save automatically to your browser. No accounts, no cloud, no data leaving your machine
- **PDF export** — Generate professional reports with one click
- **Passive House ready** — Built-in compliance checking against your target n50 value

## Features

- Full ISO 9972:2015 report structure
- Depressurization and pressurization test data entry
- Automatic volume calculations (L x W x H or Area x H methods)
- Pressure/flow scatter plots with log-log regression
- Building preparation documentation with image uploads
- Leakage identification with photo evidence
- Pass/fail compliance indicator
- Multiple saved reports
- Works offline

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Info** — Enter project details, client info, test date
2. **Conditions** — Input building dimensions, envelope area, calculate volume
3. **Preparation** — Document sealed openings with descriptions and photos
4. **Leakage** — Record identified air leakage points with images
5. **Data** — Enter pressure differentials and air change rates for each test point
6. **Graphs** — View auto-generated pressure/flow charts
7. **Results** — Set target n50, enter final test results, check compliance

Reports auto-save to localStorage. Access saved reports via the folder button. Export to PDF via the download button.

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Chart.js
- html2pdf.js

## Standards

This tool follows the structure and requirements of:

- **ISO 9972:2015** — Thermal performance of buildings — Determination of air permeability of buildings — Fan pressurization method
- **Passive House Institute** — Airtightness requirements (n50 <= 0.6 h^-1)

## License

MIT
