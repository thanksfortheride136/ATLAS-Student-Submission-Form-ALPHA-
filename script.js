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
    const formData = new FormData(document.getElementById('submissionForm'));
  
    // Disable the submit button to prevent multiple submissions
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Submitting...';
  
    fetch('https://script.google.com/macros/s/AKfycbxUvsSUOjsc1wixdkimOLWfHUADtzSE4TDlYvsd1NpbpPEOu258wsw2st9ajzH0i8vE/exec', {
      method: 'POST',
      body: formData,  // Use FormData directly
    })
    .then(response => response.text())
    .then(responseText => {
      document.getElementById('output').innerHTML = 'Response from server: ' + responseText;
  
      // Clear form fields
      document.getElementById('submissionForm').reset();
      document.getElementById('fileReadyMessage').innerHTML = '';
  
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit';
    })
    .catch(error => {
      document.getElementById('output').innerHTML = 'Error: ' + error.message;
  
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit';
    });
  }
  