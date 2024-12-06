import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrasi',
  templateUrl: './registrasi.page.html',
  styleUrls: ['./registrasi.page.scss'],
})
export class RegistrasiPage implements OnInit {
  username: any;
  password: any;
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {}

  registrasi() {
    if (this.username != null && this.password != null) {
      const data = {
        username: this.username,
        password: this.password,
      };
      this.authService.postMethod(data, 'registrasi.php').subscribe({
        next: (res) => {
          console.log({res})
          this.authService.saveData(res.token, res.username);
          this.username = '';
          this.password = '';
          this.router.navigateByUrl('/mahasiswa');
        },
        error: (e) => {
          console.log({e})
          this.authService.notifikasi(
            'Registrasi Gagal Periksa Koneksi Internet Anda'
          );
        },
      });
    } else {
      this.authService.notifikasi('Username atau Password Tidak Boleh Kosong');
    }
  }
}
