"use strict";
// =====================================================================
// Assignment 14 - TypeScript OOP - Simple Notes Management System
// =====================================================================
Object.defineProperty(exports, "__esModule", { value: true });
// =====================================================================
// Q1: Base Class – User
// - Properties: id, name, email, password, phone, age (18..60)
// - Access modifiers: id/name/email are public (readonly id),
//   password is private, phone & age are protected (visible to Admin).
// - displayInfo() prints the user's information.
// ---------------------------------------------------------------------
// Q5 (Aggregation) is also implemented inside this class: a User holds
// NoteBooks that are created OUTSIDE the user and only passed in.
// If the user is deleted, the notebooks can still exist.
// =====================================================================
class User {
    id;
    name;
    email;
    password;
    phone;
    age;
    // Q5 - Aggregation: User "has" NoteBooks but does not own their lifecycle
    notebooks = [];
    constructor(id, name, email, password, phone, age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.age = age;
        if (age < 18 || age > 60) {
            throw new Error(`Invalid age ${age}: age must be between 18 and 60`);
        }
    }
    checkPassword(input) {
        return this.password === input;
    }
    displayInfo() {
        console.log(`User #${this.id} | Name: ${this.name} | Email: ${this.email} | Phone: ${this.phone} | Age: ${this.age}`);
    }
    // ---- Q5 - Aggregation methods ----
    addNotebook(notebook) {
        this.notebooks.push(notebook);
    }
    removeNotebook(notebookId) {
        this.notebooks = this.notebooks.filter((nb) => nb.id !== notebookId);
    }
    getNotebooks() {
        return [...this.notebooks];
    }
}
// =====================================================================
// Q2: Inheritance – Admin User
// - Admin extends User (inherits all properties and displayInfo()).
// - manageNotes() lets the admin manage notes (list / edit / delete).
// =====================================================================
class Admin extends User {
    constructor(id, name, email, password, phone, age) {
        super(id, name, email, password, phone, age);
    }
    manageNotes(notebook, action, noteId, newContent) {
        switch (action) {
            case "list":
                console.log(`[Admin ${this.name}] Notes in "${notebook.name}":`);
                notebook.getNotes().forEach((n) => console.log("  -", n.preview()));
                break;
            case "edit": {
                const note = notebook.getNotes().find((n) => n.id === noteId);
                if (note && newContent !== undefined)
                    note.content = newContent;
                console.log(`[Admin ${this.name}] Edited note #${noteId}`);
                break;
            }
            case "delete":
                if (noteId !== undefined)
                    notebook.removeNote(noteId);
                console.log(`[Admin ${this.name}] Deleted note #${noteId}`);
                break;
        }
    }
    displayInfo() {
        super.displayInfo();
        console.log("  Role: Admin");
    }
}
// =====================================================================
// Q3: Class – Note
// - Properties: id, title, content, userId (reference to User)
// - preview() returns a short preview of the note content.
// ---------------------------------------------------------------------
// Q6 (Association) is implemented here: every Note MUST have an author
// (User). The Note only references the user; both live independently.
// =====================================================================
class Note {
    id;
    title;
    content;
    author;
    constructor(id, title, content, author) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
    }
    // userId taken from the referenced User
    get userId() {
        return this.author.id;
    }
    preview(length = 20) {
        const short = this.content.length > length
            ? this.content.slice(0, length) + "..."
            : this.content;
        return `${this.title}: ${short} (by ${this.author.name})`;
    }
}
// =====================================================================
// Q4: Composition – NoteBook and Notes
// - NoteBook contains a collection of Note objects.
// - addNote() / removeNote().
// - Composition: the NoteBook CREATES its notes internally (addNote
//   receives the data, not a ready Note). Notes cannot exist outside
//   the notebook; when the notebook is gone, its notes are gone too.
// =====================================================================
class NoteBook {
    id;
    name;
    notes = [];
    nextNoteId = 1;
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    addNote(title, content, author) {
        const note = new Note(this.nextNoteId++, title, content, author);
        this.notes.push(note);
        return note;
    }
    removeNote(noteId) {
        const before = this.notes.length;
        this.notes = this.notes.filter((n) => n.id !== noteId);
        return this.notes.length < before;
    }
    getNotes() {
        return this.notes;
    }
}
// =====================================================================
// Q5: Aggregation – User and NoteBook
// Implemented inside the User class above (notebooks array +
// addNotebook / removeNotebook / getNotebooks).
// A user can own multiple notebooks; notebooks are created outside the
// user and passed in, so they can live without that user.
// =====================================================================
// =====================================================================
// Q6: Association – Note and User
// Implemented inside the Note class above (author: User).
// Each Note must have an author; Note and User exist independently.
// =====================================================================
// =====================================================================
// Q7: Generics – Data Storage
// - Generic class Storage<T> that can store any type of data.
// - addItem(), removeItem(), getAllItems().
// =====================================================================
class Storage {
    items = [];
    addItem(item) {
        this.items.push(item);
    }
    removeItem(predicate) {
        this.items = this.items.filter((item) => !predicate(item));
    }
    getAllItems() {
        return [...this.items];
    }
}
// =====================================================================
// Demo / Testing
// =====================================================================
console.log("===== Q1: User =====");
const user1 = new User(1, "Ahmed", "ahmed@mail.com", "123456", "01000000000", 25);
user1.displayInfo();
try {
    new User(99, "Kid", "kid@mail.com", "pass", "0100", 15);
}
catch (e) {
    console.log("Error:", e.message);
}
console.log("\n===== Q2: Admin =====");
const admin = new Admin(2, "Sara", "sara@mail.com", "admin123", "01111111111", 30);
admin.displayInfo();
console.log("\n===== Q3 + Q4 + Q6: Note, NoteBook, Author =====");
const workNotebook = new NoteBook(1, "Work");
const n1 = workNotebook.addNote("Meeting", "Discuss the new project plan with the team on Monday", user1);
workNotebook.addNote("Todo", "Finish the TypeScript assignment", user1);
console.log(n1.preview());
console.log("userId of note 1:", n1.userId);
console.log("\n===== Q5: User owns many NoteBooks =====");
const personalNotebook = new NoteBook(2, "Personal");
user1.addNotebook(workNotebook);
user1.addNotebook(personalNotebook);
console.log(`${user1.name}'s notebooks:`, user1.getNotebooks().map((nb) => nb.name));
console.log("\n===== Q2: Admin manages notes =====");
admin.manageNotes(workNotebook, "list");
admin.manageNotes(workNotebook, "edit", 2, "Assignment finished!");
admin.manageNotes(workNotebook, "delete", 1);
admin.manageNotes(workNotebook, "list");
console.log("\n===== Q7: Generic Storage =====");
const userStorage = new Storage();
userStorage.addItem(user1);
userStorage.addItem(admin);
userStorage.removeItem((u) => u.id === 1);
console.log("Users:", userStorage.getAllItems().map((u) => u.name));
const numberStorage = new Storage();
numberStorage.addItem(10);
numberStorage.addItem(20);
numberStorage.removeItem((n) => n === 10);
console.log("Numbers:", numberStorage.getAllItems());
//# sourceMappingURL=index.js.map