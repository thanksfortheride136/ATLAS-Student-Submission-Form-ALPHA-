// Predefined student lists for each class
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

// Function to populate student names based on class selection
function populateStudentNames() {
    const className = document.getElementById('className').value;
    const studentDropdown = document.getElementById('studentName');
    
    // Clear any previous student names
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
function submitForm() {
    const studentName = document.getElementById('studentName').value;
    const className = document.getElementById('className').value;
    const projectName = document.getElementById('projectName').value;
    const files = document.getElementById('fileUpload').files;

    // Check if any files were selected
    if (files.length === 0) {
        document.getElementById('output').innerHTML = 'Error: Please upload at least one file.';
        return;  // Stop form submission if no files are uploaded
    }

    // Prepare formData object
    const formDataObj = {
        studentName: studentName,
        className: className,
        projectName: projectName,
        files: []  // Initialize empty file array
    };

    // Process selected files and convert to base64
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            formDataObj.files.push({
                name: files[i].name,
                data: e.target.result
            });

            // Once all files are processed, send the form
            if (formDataObj.files.length === files.length) {
                sendFormData(formDataObj);
            }
        };
        reader.onerror = function(e) {
            console.error('Error reading file: ', e);
        };
        reader.readAsDataURL(files[i]);  // Convert file to base64
    }

    // Disable submit button to prevent multiple clicks
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Submitting...';
}

// Function to send form data via fetch to Google Apps Script
function sendFormData(formDataObj) {
    fetch('https://script.google.com/macros/s/AKfycbwIFxtBKSaSaKwsMdndUXG3Lai5Y3nvdYvATyIdyQxHaQuXKUkErC-TYjXvZO_wBR8Q2Q/exec', {
        method: 'POST',
        body: JSON.stringify(formDataObj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return response.text();  // Get full response as text
    })
    .then(responseText => {
        console.log('Response from server: ', responseText);
        document.getElementById('output').innerHTML = 'Response from server: ' + responseText;

        // Clear form fields
        document.getElementById('submissionForm').reset();
        document.getElementById('fileReadyMessage').innerHTML = '';

        // Re-enable submit button
        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit';
    })
    .catch(error => {
        console.error('Fetch error: ', error);
        document.getElementById('output').innerHTML = 'Fetch error: ' + error.message;

        // Re-enable submit button
        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit';
    });
}
