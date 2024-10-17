// Student data (using fictional names as requested earlier)
const studentData = {
    "AP Computer Science Principles": ["Pixel Byteson", "Algo Loopius", "Data Arrayana", "Cyber Codecraft", "Binary Boolena", "Syntax Errorson", 
    "Function Callaway", "Variable Declara", "Logic Gateson", "Query Selectora", "Compile Debugger", "Script Kiddie", "Hack McCode"],
    "Engineering 1 (Period 3)": ["Gears McGadget", "Bolt Screwdriver", "Wrench Spannerson", "Cog Wheelson", "Lever Pulleyson", "Circuit Boardia",
     "Weld Solderbot", "Beam Trussmaker", "Torque Newtonson", "Piston Cylindra", "Alloy Metallurgy"],
    "Engineering 1 (Period 7)": ["Robo Tronix", "Mecha Droidson", "Nano Botson", "Quantum Computron", "Laser Opticson", "Drone Hoverson", 
    "Fusion Reactora", "Cyber Netson", "Techno Futura", "Holo Grammerson", "Dynamo Voltagius", "Widget Gizmonic", "Pixel Screenson", "Chip Siliconix"],
    "Engineering 2": ["Rocket Thrustinator", "Jet Propulsia", "Gyro Stabilizor", "Sonar Echolocator", "Hydraulic Pressureson", "Pneumatic Airpumpsky"],
    "STEM 8": ["Beaker Bunsenburner", "Pipette Volumetrica", "Petri Dishson"]
};

// Function to populate student names based on class selection
function populateStudentNames() {
    const className = document.getElementById('className').value;
    const studentDropdown = document.getElementById('studentName');
    
    studentDropdown.innerHTML = '<option value="">-- Select Student --</option>';

    if (className && studentData[className]) {
        const students = studentData[className];
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student;
            option.textContent = student;
            studentDropdown.appendChild(option);
        });
    }
}

// Show a message when files are selected
document.getElementById('fileUpload').addEventListener('change', function(event) {
    const files = event.target.files;
    if (files.length > 0) {
        document.getElementById('fileReadyMessage').innerHTML = files.length + ' file(s) selected. Ready to submit!';
    } else {
        document.getElementById('fileReadyMessage').innerHTML = '';
    }
});

// Form submission
async function submitForm() {
    const studentName = document.getElementById('studentName').value;
    const className = document.getElementById('className').value;
    const projectName = document.getElementById('projectName').value;
    const files = document.getElementById('fileUpload').files;

    const formDataObj = {
        studentName: studentName,
        className: className,
        projectName: projectName,
        files: []
    };

    try {
        // Process files if any are selected, but don't require them
        for (let i = 0; i < files.length; i++) {
            const base64Data = await readFileAsBase64(files[i]);
            formDataObj.files.push({
                name: files[i].name,
                data: base64Data
            });
        }

        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Submitting...';

        await sendFormData(formDataObj);
    } catch (error) {
        console.error('Error processing form:', error);
        document.getElementById('output').innerHTML = 'Error processing form: ' + error.message;
    } finally {
        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit';
    }
}

// Function to read file as base64
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Error reading file'));
        reader.readAsDataURL(file);
    });
}

// Function to send form data via fetch to Google Apps Script
async function sendFormData(formDataObj) {
    // TODO: Replace this URL with your new Google Apps Script Web App URL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyZFJ2qtTtcwvZZ8d5FdmqLejRy1Z3zSdJD4Utb8pFNWvcils-RImp_0P4d-sywdYjiYg/exec';

    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify(formDataObj),
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            throw new Error('Invalid JSON response from server');
        }

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}, ${responseData.message || responseText}`);
        }

        console.log('Response from server:', responseData);
        document.getElementById('output').innerHTML = 'Response from server: ' + JSON.stringify(responseData);

        // Clear form fields
        document.getElementById('submissionForm').reset();
        document.getElementById('fileReadyMessage').innerHTML = '';
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('output').innerHTML = 'Fetch error: ' + error.message;
    }
}