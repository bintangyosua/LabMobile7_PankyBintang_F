import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AlertController, ModalController } from '@ionic/angular';
import { logoIonic } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mahasiswa',
  templateUrl: './mahasiswa.page.html',
  styleUrls: ['./mahasiswa.page.scss'],
})
export class MahasiswaPage implements OnInit {
  dataMahasiswa: any;
  modalTambah: any;
  id: any;
  nama: any;
  jurusan: any;
  modalEdit: any;

  constructor(
    private api: ApiService,
    private modal: ModalController,
    private alert: AlertController,
    private authService: AuthenticationService,
    private router: Router
  ) {
    addIcons({ logoIonic });
  }

  ngOnInit() {
    this.getMahasiswa();
  }

  resetModal() {
    this.id = null;
    this.nama = '';
    this.jurusan = '';
  }


  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  tambahMahasiswa() {
    if (this.nama != '' && this.jurusan != '') {
      let data = {
        nama: this.nama,
        jurusan: this.jurusan,
      };
      this.api.tambah(data, 'tambah.php').subscribe({
        next: (hasil: any) => {
          this.resetModal();
          console.log('berhasil tambah mahasiswa');
          this.getMahasiswa();
          this.modalTambah = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal tambah mahasiswa');
        },
      });
    } else {
      console.log('gagal tambah mahasiswa karena masih ada data yg kosong');
    }
  }

  async konfirmasiHapus({
    id,
    nama,
    jurusan,
  }: {
    id: number;
    nama: string;
    jurusan: string;
  }) {
    const alert = await this.alert.create({
      header: 'Hapus',
      message: `Apakah anda yakin ingin menghapus data Mahasiswa dengan nama ${nama} dari jurusan ${jurusan}?`,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Hapus',
          role: 'confirm',
          handler: () => {
            this.hapusMahasiswa(id);
            return;
          },
        },
      ],
    });

    await alert.present();
  }

  hapusMahasiswa(id: any) {
    this.api.hapus(id, 'hapus.php?id=').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.getMahasiswa();
        console.log('berhasil hapus data');
      },
      error: (error: any) => {
        console.log('gagal');
      },
    });

    return;
  }

  editMahasiswa() {
    let data = {
      id: this.id,
      nama: this.nama,
      jurusan: this.jurusan,
    };
    this.api.edit(data, 'edit.php').subscribe({
      next: (hasil: any) => {
        console.log(hasil);
        this.resetModal();
        this.getMahasiswa();
        console.log('berhasil edit Mahasiswa');
        this.modalEdit = false;
        this.modal.dismiss();
      },
      error: (err: any) => {
        console.log('gagal edit Mahasiswa');
      },
    });
  }

  ambilMahasiswa(id: any) {
    this.api.lihat(id, 'lihat.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        let mahasiswa = hasil;
        this.id = mahasiswa.id;
        this.nama = mahasiswa.nama;
        this.jurusan = mahasiswa.jurusan;
      },
      error: (error: any) => {
        console.log('gagal ambil data');
      },
    });
  }

  openModalTambah(isOpen: boolean) {
    this.modalTambah = isOpen;
    this.resetModal();
    this.modalTambah = true;
    this.modalEdit = false;
  }

  cancel() {
    this.modal.dismiss();
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  getMahasiswa() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataMahasiswa = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilMahasiswa(this.id);
    this.modalTambah = false;
    this.modalEdit = true;
  }
}
