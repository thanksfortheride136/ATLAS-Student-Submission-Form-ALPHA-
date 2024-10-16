// This function serves the HTML form when the web app is accessed
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('File Submission Form');
}

function processForm(formData) {
  try {
    // Log start of process
    Logger.log('Processing form data...');
    
    // Retrieve form data
    var studentName = formData.studentName;
    var className = formData.className;
    var projectName = formData.projectName;
    var files = formData.files;

    // Log form data
    Logger.log('Student: ' + studentName + ', Class: ' + className + ', Project: ' + projectName);

    // Check if any files were uploaded
    if (!files || files.length === 0) {
      Logger.log('No files uploaded.');
      return 'No files uploaded. Please select at least one file.';
    }

    // Main folder ID (change this to your desired folder ID)
    var mainFolderId = '1LXeG-jLA4gQchajho2O3gJroOjSW0sLJ'; // Replace with your Google Drive folder ID
    Logger.log('Main folder ID: ' + mainFolderId);

    // Get or create Class folder
    var classFolder = getOrCreateFolder(className, mainFolderId);
    Logger.log('Class folder ID: ' + classFolder.getId());

    // Get or create Project folder within Class folder
    var projectFolder = getOrCreateFolder(projectName, classFolder.getId());
    Logger.log('Project folder ID: ' + projectFolder.getId());

    // Get or create a student folder within the project folder
    var studentFolder = getOrCreateFolder(studentName, projectFolder.getId());
    Logger.log('Student folder ID: ' + studentFolder.getId());

    // Upload the files to the student's folder
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var content = Utilities.base64Decode(file.data.split(',')[1]);
      var blob = Utilities.newBlob(content, 'application/octet-stream', file.name);

      // Save file to the student folder
      Logger.log('Saving file to student folder: ' + file.name);
      studentFolder.createFile(blob);
    }

    return 'Files uploaded successfully!';
  } catch (error) {
    Logger.log('Error processing form: ' + error.message);
    return 'Error processing form: ' + error.message;
  }
}

// Utility function to get or create a folder by name within a parent folder
function getOrCreateFolder(folderName, parentFolderId) {
  Logger.log('Getting or creating folder: ' + folderName);
  var parentFolder = DriveApp.getFolderById(parentFolderId);
  var folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return parentFolder.createFolder(folderName);
  }
}
