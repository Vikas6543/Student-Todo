// Represents a Students Details
class Student {
    constructor(firstname, lastname, usn) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.usn = usn;
    }
}


// UI Class: Handle UI Tasks
class UI {
    // displayStudents
    static displayStudents() {
        const students = Store.getStudents();
        students.forEach((student) => UI.addStudentToList(student));
    }

    // addStudentToList
    static addStudentToList(student) {
        const list = document.querySelector('#students-list');

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.firstname}</td>
          <td>${student.lastname}</td>
          <td>${student.usn}</td>
          <td><a href="#" class="delete">X</td>
        `;
        list.appendChild(row);
    }

    // Deletes Student
    static deleteStudent(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

     // Shows an alert
     static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `mt-3 alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const aboveTable = document.querySelector('.table');
        container.insertBefore(div, aboveTable);

        // Vanish in 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

   // Set All Input to Empty after Submitting Form
    static clearFields() {
        document.querySelector('#firstname').value = '';
        document.querySelector('#lastname').value = '';
        document.querySelector('#usn').value = '';
    }
}

// Local Storage
class Store {
    static getStudents() {
        let students;
        if(localStorage.getItem('students') === null){
            students = [];
        } else {
            students = JSON.parse(localStorage.getItem('students'));
        }

        return students;
    }

    // addStudent
    static addStudent(student) {
        const students = Store.getStudents();
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
    }

    // removeStudent
    static removeStudent(usn) {
        const students = Store.getStudents();
        students.forEach((student, index) => {
            if(student.usn === usn){
                students.splice(index, 1);
            }
        });

        localStorage.setItem('students', JSON.stringify(students));
    }
}




// Event: Display Students
document.addEventListener('DOMContentLoaded', UI.displayStudents);

// Event: Add a Student
document.querySelector('#students-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const firstname = document.querySelector('#firstname').value;
    const lastname = document.querySelector('#lastname').value;
    const usn = document.querySelector('#usn').value;

  // Validate
  if(firstname === '' || lastname === '' || usn === ''){
    UI.showAlert('Please fill in all fields.', 'danger');
} else {
    // Instantiate Student
    const student = new Student(firstname, lastname, usn);
        
    // Add Student to UI
    UI.addStudentToList(student);

    // Add Student to Local-Storage
    Store.addStudent(student);

    // Show Success message
    UI.showAlert(`${firstname} is Added to list.`, 'success');

    // Clear Fields
    UI.clearFields();
 }
});

// Event: Delete a Student
document.querySelector('#students-list').addEventListener('click', (e) => {
    UI.deleteStudent(e.target);

    // Delete from local storage
    Store.removeStudent(e.target.parentElement.previousElementSibling.textContent);

    //show student deleted message after deleting
    UI.showAlert(`${e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent} is Removed from the list.`, 'success');
});
