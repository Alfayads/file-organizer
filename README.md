# File Organizer

File Organizer is a desktop application that helps you keep your folders tidy by automatically organizing files into specific subdirectories based on their type.

## Features

*   **Folder Monitoring:** Select any folder on your computer to be monitored for new files.
*   **Automatic Organization:** Automatically moves new files into categorized subdirectories (e.g., Images, Documents, Videos, Others) based on file extensions.
*   **User-Friendly Interface:** Simple interface to select the source folder and view real-time logs of file operations.
*   **System Tray Access:** Runs in the system tray for easy access to open the application window or quit.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm) installed on your system.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/alfayads/file-organizer.git
    cd file-organizer
   

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

To run the application in development mode:

```bash
npm start
```

This will launch the File Organizer application window.

### Basic Workflow

1.  **Launch the application:** After starting, the main window will appear.
2.  **Select a Folder:** Click the "Select Folder to Monitor" button. A dialog will open, allowing you to choose the folder you want the application to watch.
3.  **Monitoring:** Once a folder is selected, the application will immediately start monitoring it for new files.
    *   Any new file added directly to the root of this monitored folder will be processed.
    *   Files are moved into subdirectories named `Images`, `Documents`, `Videos`, or `Others` within the monitored folder, based on their type.
4.  **View Logs:** File movement operations and any errors are logged in the text area within the application window.
5.  **Stop Monitoring:** You can stop the file monitoring process by clicking the "Stop Monitoring" button in the application or by closing the application.
6.  **System Tray:** The application icon will appear in the system tray. You can right-click it to open the application window or quit the application.

## Building the Application

To create a distributable version of the application, you can use the build script defined in `package.json`.

Currently, the build is configured for macOS:

```bash
npm run build
```

This command will use `electron-builder` to package the application. The output (e.g., a `.app` file or a `.dmg` installer for macOS) will typically be found in a `dist` or `release` directory within the project folder.

For other platforms (Windows, Linux), you may need to adjust the `electron-builder` configuration in `package.json`.

## Running Tests

The project uses Jest for testing. To run the test suite:

```bash
npm test
```

This command will execute all test files (typically those ending with `.test.js` or `.spec.js`) and output the results to the console.

## Linting

The project uses ESLint for code linting to maintain code quality and consistency. To check the codebase:

```bash
npm run lint
```

This command will analyze the code in the `src` directory and report any linting errors or warnings.

## Logging

The application logs its activities and any errors encountered.
*   **In-App Logs:** Real-time logs of file operations are displayed directly within the application's main window.
*   **File Logs:** Detailed logs are also saved to a file named `app.log`. You can find this file in the application's user data directory.
    *   On macOS: `~/Library/Application Support/file-organizer/app.log`
    *   On Windows: `%APPDATA%\file-organizer\app.log` (e.g., `C:\Users\<username>\AppData\Roaming\file-organizer\app.log`)
    *   On Linux: `~/.config/file-organizer/app.log`
