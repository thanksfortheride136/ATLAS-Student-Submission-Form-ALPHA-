// Student data (unchanged)
const studentData = {
    "AP Computer Science Principles": ["Erica Colabella", "Yadiel De La Mota", "Colin Djurkinjak", "Elizabeth Gjelaj", "Victoria Gjelaj", "Vincent Handy", 
    "Grace Kern", "Sophia Marku", "Gregory McCormack", "James Peters", "Chloe Piedmont", "Dylan Rigby", "Maya Sarma"],
    "Engineering 1 (Period 3)": ["Adri Azemi", "Amiya Bah", "Mason Bogetti", "Jack Carinci", "Anthony Cermele", "Jenna Chen",
     "Ariel Genao", "Justin Gjekaj", "Caden Goldberg", "Riku Katsuno", "Zakary Simpson"],
    "Engineering 1 (Period 7)": ["Gianni Addeo", "Tommy Camejo", "Isabella Carinci", "Giovanni Del Mistro", "Lily Fleming", "Erin Gerken", 
    "Dean Goldstein", "Emiliano Hernandez-Ferro", "Andrew Kubaska", "Cameron Ly", "Ephraim Mironchuk", "Dominic Restifo", "Aniya Shaw", "Mishel Syed"],
    "Engineering 2": ["Gavin Barreno", "Lucas Hofflich", "Jon Ludi", "Santiago Ortega-Brown", "Luciana Vasquez", "Leila Garguilo"],
    "STEM 8": ["Steve Rogers", "Bucky Barnes", "Sam Wilson"]
};

// Function to populate student names (unchanged)
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

// Show a message when files are selected (unchanged)
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

    if (files.length === 0) {
        document.getElementById('output').innerHTML = 'Error: Please upload at least one file.';
        return;
    }

    const formDataObj = {
        studentName: studentName,
        className: className,
        projectName: projectName,
        files: []
    };

    try {
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
        console.error('Error processing files:', error);
        document.getElementById('output').innerHTML = 'Error processing files: ' + error.message;
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
    const scriptUrl = 'https://script.google.com/macros/s/AKfycby-HwXT5oq1yKnOEKn4ISbCGcLlk-Cn59xVeY86vxURf5-7JWXxCKR9hgb2xC2U4l-qtw/exec';

    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify(formDataObj),
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const responseText = await response.text();
        console.log('Response from server:', responseText);
        document.getElementById('output').innerHTML = 'Response from server: ' + responseText;

        // Clear form fields
        document.getElementById('submissionForm').reset();
        document.getElementById('fileReadyMessage').innerHTML = '';
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('output').innerHTML = 'Fetch error: ' + error.message;
    } finally {
        // Re-enable submit button
        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit';
    }
}