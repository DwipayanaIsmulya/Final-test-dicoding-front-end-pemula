const listItems = document.querySelectorAll(".list-item");
listItems.forEach((item) => {
  item.onclick = () => {
    listItems.forEach((item) => item.classList.remove("active"));
    item.classList.add("active");
  };
});

document.querySelectorAll(".text-input").forEach((element) => {
  element.addEventListener("blur", (event) => {
    if (event.target.value != "") {
      event.target.nextElementSibling.classList.add("filled");
    } else {
      event.target.nextElementSibling.classList.remove("filled");
    }
  });
});

// ===== Pengolahan ===== //

const localStorageKey = "BookshelfApps";
let bookshelfApp = [];
const tambahBuku = document.querySelector(".tambah");

// Cek Web Apakah Support
const apakahSupport = () => {
  return typeof Storage !== undefined;
};

if (apakahSupport()) {
  if (localStorage.getItem(localStorageKey) === null) {
    bookshelfApp = [];
  } else {
    bookshelfApp = JSON.parse(localStorage.getItem(localStorageKey));
  }
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
}

// Tambah Buku
const addBook = (Obj, localStorageKey) => {
  bookshelfApp.push(Obj);
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
};

// Hapus Buku
const deleteBook = (book) => {
  bookshelfApp.splice(book, 1);
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
  buatBuku(bookshelfApp);
};

// Pindah ke Sudah Dibaca
const finishedRead = (book) => {
  bookshelfApp[book].isCompleted = true;
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
  buatBuku(bookshelfApp);
};

// Pindah ke Belum Dibaca
const unfinishedRead = (book) => {
  bookshelfApp[book].isCompleted = false;
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
  buatBuku(bookshelfApp);
};

// Cari Judul Buku
const cariBuku = (kw) => {
  const r = bookshelfApp.filter((book) =>
    book.judul.toLowerCase().includes(kw.toLowerCase())
  );
  buatBuku(r);
};

// Display Buku ke HTML
const sudahDibaca = "right-container-buku-wrapper";
const belumDibaca = "left-container-buku-wrapper";

const buatBuku = (bookshelfApp) => {
  const books = bookshelfApp;

  const listUnfinished = document.getElementById(belumDibaca);
  const listFinished = document.getElementById(sudahDibaca);

  listUnfinished.innerHTML = "";
  listFinished.innerHTML = "";

  for (let book of books.keys()) {
    // Element Pembungkus
    const container = document.createElement("div");
    container.classList.add("buku");

    // Element Detail
    const printJudulBuku = document.createElement("h1");
    printJudulBuku.innerHTML = books[book].judul;

    const printPenulisBuku = document.createElement("p");
    printPenulisBuku.innerHTML = "Penulis : " + books[book].penulis;

    const printTahunBuku = document.createElement("p");
    printTahunBuku.innerHTML = "Tahun : " + books[book].tahun;

    // Element Button
    const containerButton = document.createElement("div");
    containerButton.classList.add("button-buku");

    const buttonIsComplete = document.createElement("button");

    if (books[book].isCompleted) {
      buttonIsComplete.classList.add("selesai");
      buttonIsComplete.innerHTML = "Belum";
      buttonIsComplete.addEventListener("click", function () {
        unfinishedRead(book);
      });
    } else {
      buttonIsComplete.classList.add("selesai");
      buttonIsComplete.innerHTML = "Selesai";
      buttonIsComplete.addEventListener("click", function () {
        finishedRead(book);
      });
    }

    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("delete");
    buttonDelete.innerHTML = "Hapus";
    buttonDelete.addEventListener("click", function () {
      let confirmDelete = confirm(
        "Apakah Ingin Menghapus Buku " + books[book].judul
      );
      if (confirmDelete) {
        deleteBook(book);
      }
    });

    containerButton.append(buttonIsComplete, buttonDelete);

    container.append(
      printJudulBuku,
      printPenulisBuku,
      printTahunBuku,
      containerButton
    );

    if (books[book].isCompleted) {
      listFinished.append(container);
    } else {
      listUnfinished.append(container);
    }
  }
};

// Cari Buku Event Handler
const cariBukuForm = document.getElementById("cariBuku");
cariBukuForm.addEventListener("submit", (e) => {
  const kw = document.querySelector("#cariJudulBuku").value;
  e.preventDefault();
  cariBuku(kw);
});

tambahBuku.addEventListener("click", function () {
  // Ambil Nilai Baru Dari Form
  const judulBuku = document.getElementById("judul").value;
  const penulisBuku = document.getElementById("penulis").value;
  const tahunBuku = document.getElementById("tahun").value;
  const isCompleted = document.getElementById("isComplete").checked;

  // Masukkan Kedalam Objek
  let Obj = {
    id: +new Date(),
    judul: judulBuku,
    penulis: penulisBuku,
    tahun: tahunBuku,
    isCompleted: isCompleted,
  };

  // Apakah Isian Form Kosong ?
  if (judulBuku && penulisBuku && tahunBuku) {
    addBook(Obj, localStorageKey);
  } else {
    return alert("The field can't be blank");
  }

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  buatBuku(bookshelfApp);
});

window.addEventListener("load", function () {
  if (apakahSupport) {
    buatBuku(bookshelfApp);
  } else {
    this.alert("Browser Kamu Tidak Mendukung Penyimpanan Web!");
  }
});
