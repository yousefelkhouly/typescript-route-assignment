export {};

// 1.
class User {
  private notebooks: NoteBook[] = [];

  constructor(
    public id: number,
    public name: string,
    protected email: string,
    private password: string,
    protected phone: string,
    private age: number,
  ) {
    if (age < 18 || age > 60) {
      throw new Error("age must be between 18 and 60");
    }
  }

  displayInfo(): void {
    console.log(
      `ID: ${this.id}, Name: ${this.name}, Email: ${this.email}, Phone: ${this.phone}, Age: ${this.age}`,
    );
  }

  addNotebook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }

  getNotebooks(): NoteBook[] {
    return this.notebooks;
  }
}

// test
const user = new User(1, "joo", "yousef@g.com", "123456", "01000000000", 22);
user.displayInfo();

try {
  new User(3, "ali", "ali@g.com", "pass", "01222222222", 15);
} catch (error) {
  console.log((error as Error).message);
}

// 2.
class Admin extends User {
  manageNotes(notebook: NoteBook, noteId: number): void {
    notebook.removeNote(noteId);
    console.log(`Admin ${this.name} deleted note #${noteId}`);
  }
}

// test
const admin = new Admin(
  2,
  "joo2",
  "admin@g.com",
  "admin123",
  "01111111111",
  35,
);
admin.displayInfo();

// 3.
class Note {
  public userId: number;

  constructor(
    public id: number,
    public title: string,
    public content: string,
    public author: User,
  ) {
    this.userId = author.id;
  }

  preview(): string {
    return this.content.slice(0, 20) + "...";
  }
}

// test
const note = new Note(1, "welcome", "my first note in the app", user);
console.log(note.preview());

// 4.
class NoteBook {
  private notes: Note[] = [];

  constructor(
    public id: number,
    public name: string,
  ) {}

  addNote(id: number, title: string, content: string, author: User): void {
    this.notes.push(new Note(id, title, content, author));
  }

  removeNote(id: number): void {
    this.notes = this.notes.filter((note) => note.id !== id);
  }

  getNotes(): Note[] {
    return this.notes;
  }
}

// test
const notebook = new NoteBook(1, "study");
notebook.addNote(
  1,
  "TypeScript",
  "Generics make code reusable and type-safe",
  user,
);
notebook.addNote(
  2,
  "OOP",
  "inheritance, composition, aggregation, association",
  user,
);
console.log(`Notes: ${notebook.getNotes().length}`);
admin.manageNotes(notebook, 2);
console.log(`Notes left: ${notebook.getNotes().length}`);

// 5.
// test
const workNotebook = new NoteBook(2, "work");
user.addNotebook(notebook);
user.addNotebook(workNotebook);
console.log(
  `${user.name} owns: ${user
    .getNotebooks()
    .map((nb) => nb.name)
    .join(", ")}`,
);

// 6.
// test
notebook.getNotes().forEach((n) => {
  console.log(`"${n.title}" written by ${n.author.name} (userId: ${n.userId})`);
});

// 7.
class Storage<T> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(item: T): void {
    this.items = this.items.filter((i) => i !== item);
  }

  getAllItems(): T[] {
    return this.items;
  }
}

// test
const numberStorage = new Storage<number>();
numberStorage.addItem(10);
numberStorage.addItem(20);
numberStorage.removeItem(10);
console.log(numberStorage.getAllItems());

const userStorage = new Storage<User>();
userStorage.addItem(user);
userStorage.addItem(admin);
console.log(userStorage.getAllItems().map((u) => u.name));
