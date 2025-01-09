import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Configure environment variables
dotenv.config();

// Get current file's directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Construct path to Python script using the correct subdirectories
const pythonScriptPath = join(__dirname, 'src', 'pythonML Model', 'scheme.py');

// Function to run the Python backend
function runPythonBackend() {
    // Use python3 on Unix-like systems and python on Windows
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    
    console.log(`Starting Python backend at: ${pythonScriptPath}`);
    
    const child = exec(`${pythonCommand} "${pythonScriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error('Failed to start Python backend:', error.message);
            return;
        }
        if (stderr) {
            console.error('Python backend error:', stderr);
            return;
        }
        console.log('Python backend output:', stdout);
    });

    // Forward Python process output to Node console
    child.stdout?.on('data', (data) => {
        console.log(`Python output: ${data}`);
    });

    child.stderr?.on('data', (data) => {
        console.error(`Python error: ${data}`);
    });

    // Handle process exit
    child.on('exit', (code) => {
        if (code !== 0) {
            console.log(`Python process exited with code ${code}`);
        }
    });
}

// Start the Python backend
runPythonBackend();