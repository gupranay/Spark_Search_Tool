# How the SPARK Search Tool Works

This document explains how to use the SPARK Search Tool to find and download consultant information. This tool helps you search through SPARK's database of vendors and consultants across different categories.

## Overview

The SPARK Search Tool is a simple web application that lets you:

1. Select a category of vendors/consultants from a dropdown menu
2. Pull data for that category
3. Search through the results
4. Download the data as a CSV file

---

## Step-by-Step Guide

### 1. Selecting a Category (Dropdown Menu)

When you first open the website, you'll see a dropdown menu labeled "Select a category of consultants." This menu contains different types of vendors and consultants that SPARK works with, such as:

- Accountants
- Augmented Reality/Virtual Reality (AR/VR)
- Branding
- Communications Consultants
- Designers
- Entrepreneur in Residence (EIR)
- Human Resources (HR)
- Insurance
- Intellectual Property (IP)
- Legal
- Marketing
- Photography
- Public Relations (PR)
- Software
- User Interface/User Experience (UI/UX)
- Website
- Writers

**How it works:** Simply click on the dropdown menu and choose the category you're interested in. Each category represents a different type of professional service provider in SPARK's database.

---

### 2. Pulling Data

Once you've selected a category, click the **"Pull Data"** button. This button tells the system to:

1. **Connect to the database**: The system sends a request to SPARK's database (via a service called Make.com) to retrieve all consultant information for your selected category.

2. **Process the information**: The system receives the raw data and organizes it into a readable table format with columns like:

   - Account Name
   - Contact information
   - Communication preferences
   - And other relevant details

3. **Display the results**: The data appears in a table below the search box. You'll see a loading spinner while the data is being retrieved.

**Important notes:**

- The button will show "Pulling Data..." while it's working
- You must select a category before you can pull data
- The process may take a few seconds depending on how much data is in that category

---

### 3. Searching Through Results

After the data has been pulled and displayed, you can use the search box to find specific consultants or information.

**How it works:**

- Type any word or phrase into the search box (e.g., a company name, person's name, or keyword)
- The table automatically filters to show only rows that contain your search term
- The search looks through **all columns** in the table, so you can search by any field
- The search is not case-sensitive (it doesn't matter if you use capital or lowercase letters)

**Example:** If you type "Marketing" in the search box, you'll see all consultants whose information contains the word "Marketing" anywhere in their record.

**Special sorting:** The results are automatically sorted so that:

- Consultants on the "Funder List" appear first (these are consultants who may have grant funding available)
- New consultants (marked with an asterisk \*) are grouped together
- Records are then sorted alphabetically by company name and contact name

---

### 4. Downloading Data

Once you have data displayed (either all results or filtered search results), you can download it to your computer.

**How it works:**

1. Click the **"Download CSV"** button
2. The system creates a CSV (Comma-Separated Values) file containing all the data you've pulled
3. The file is automatically saved to your computer with a filename like: `Accountants_consultant_data.csv` (the category name will match what you selected)

**What gets downloaded:**

- All the data that was pulled for your selected category
- The file includes all columns except the "Communication List" column (which is used internally for sorting)
- The file can be opened in Excel, Google Sheets, or any spreadsheet program

**Important notes:**

- The download button is only available after you've successfully pulled data
- The downloaded file contains all the data from your pull, not just what's currently visible in a filtered search
- CSV files are a standard format that work with most spreadsheet applications

---

## Understanding the Table Display

When data is displayed, you'll see a table with multiple columns showing different pieces of information about each consultant. Here are some things to know:

- **Clicking on a row**: You can click on any row in the table to expand it and see the full content of cells that have been truncated (shortened with "...")
- **Asterisk (\*) indicator**: Rows marked with an asterisk (\*) in the first column indicate consultants who are new to SPARK's resource database
- **Long text**: Some cells may show shortened text with "..." at the end. Click the row to see the full content.

---

## Summary

The SPARK Search Tool is designed to be straightforward:

1. **Choose** a category from the dropdown
2. **Pull** the data for that category
3. **Search** through the results if needed
4. **Download** the data to use in your own spreadsheets

The tool connects to SPARK's database, retrieves the information you need, and presents it in an easy-to-use format that you can search and download as needed.
