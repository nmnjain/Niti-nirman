import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

exec('python "C:\\Users\\jainn\\Downloads\\ey hackathon\\pythonML Model\\scheme.py"', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
