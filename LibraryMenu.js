const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./library.db');
var Table = require('cli-table');
var readlline = require('readline');

var rl = readlline.createInterface({
    input: process.stdin,
    output: process.stdout
});




//1. menampilkan menu perpustakaan
function menuPerpus() {
    console.log('===========================================================');
    console.log(`Welcome to Simple Library App `);
    console.log('===========================================================');
    console.log(`
===========================================================
Choose The Option Below
[1] List Of Books
[2] List All Rented Books
[3] Find Book
[4] Add Book
[5] Rent Book
[6] Return Book
===========================================================
`);

    rl.question('Choose The Option Above: ', (answer) => {
        switch (answer) {
            case "1":
                daftarBuku();
                break;
            case "2":
                daftarPinjamBuku();
                break;
            case "3":
                cariBuku();
                break;
            case '4':
                tambahBuku();
                break;
            case '5':
                pinjamBuku();
                break;
            case '6':
                kembalikanBuku();
                break;           
           

            default:
                break;
        }

    });

}

function daftarBuku() {
    db.serialize(() => {
        const sql = 'SELECT * FROM perpustakaan';
        db.all(sql, function (err, perpustakaan) {

            // if (perpustakaan) {
            let table = new Table({
                head: ['Code of Book', 'Name of Book', 'Status']
                , colWidths: [20, 30, 10]
            });
            //*looping trough perpustakaan using forEach because it is array data
            perpustakaan.forEach(perpustakaan => {

                table.push(
                    [perpustakaan.kode_buku, perpustakaan.judul, perpustakaan.status]
                );
            });
            console.log(table.toString());
            menuPerpus();

        });
    });
}

function daftarPinjamBuku() {
    db.serialize(() => {
        const sql = `SELECT * FROM perpustakaan WHERE Status = 'rent' `;
        db.all(sql, function (err, perpustakaan) {
            let table = new Table({
                head: ['Kode Buku', 'Judul', 'Status']
                , colWidths: [20, 30, 10]
            });
            //*looping trough perpustakaan using forEach because it is array data
            perpustakaan.forEach(perpustakaan => {

                table.push(
                    [perpustakaan.kode_buku, perpustakaan.judul, perpustakaan.status]
                );
            });
            console.log(table.toString());
            menuPerpus();

        });
    });
}

function cariBuku() {
    console.log('===========================================================');
    rl.question('Masukan Kode buku: ', (answer) => {
        db.serialize(() => {
            const sql = `SELECT * FROM perpustakaan WHERE kode_buku = ?`;
            db.get(sql, [answer], function (err, perpustakaan) {
                if (err) throw err;
                if (perpustakaan) {
                    console.log('===========================================================');
                    console.log(`Books details`);
                    console.log('===========================================================');
                    console.log(`id         :${perpustakaan.kode_buku} `);
                    console.log(`nama       :${perpustakaan.judul} `);
                    console.log(`status    :${perpustakaan.status} `);
                    menuPerpus();
                } else {
                    console.log(`Book ${answer} not recorded`);
                    cariBuku();
                }

            });
        });
    });
}



function tambahBuku() {
    console.log('===========================================================');
    console.log('Complete Data Below:');
    rl.question('Name of Book: ', (judul) => {
            rl.question('Status:', (status) => {
                db.serialize(() => {
                    const kodeBuku = parseInt(Date.now());
                    const sql = `INSERT INTO perpustakaan(kode_buku,judul,status) VALUES(?,?,?)`;
                    //insert into database using db.run
                    /** using query binding ===> */
                    db.run(sql, [kodeBuku, judul, status], (err) => {
                        if (err) throw err;
                        daftarBuku();

                    });
                });
            });
    });
}

function pinjamBuku() {
    console.log('===========================================================');
    rl.question(`type code of book: `, (kode_buku) => {
        db.serialize(() => {


            const sql = ` UPDATE perpustakaan SET Status = 'rent' WHERE kode_buku = ?`;
            db.run(sql, [kode_buku], (err) => {
                if (err) throw err;


                console.log(`Book ${kode_buku} has rented`);
                daftarBuku();
            });

        });


    });
}

function kembalikanBuku() {
    console.log('===========================================================');
    rl.question(`type code of book: `, (kode_buku) => {
        db.serialize(() => {


            const sql = ` UPDATE perpustakaan SET Status = 'returned' WHERE kode_buku = ?`;
            db.run(sql, [kode_buku], (err) => {
                if (err) throw err;


                console.log(`book ${kode_buku} has returned`);
                daftarBuku();
            });

        });


    });

}

menuPerpus();



