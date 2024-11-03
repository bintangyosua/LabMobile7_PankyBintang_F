# Tugas 7 Praktikum Pemrograman Mobile

```yml
Nama: Panky Bintang Pradana Yosua
NIM: H1D022077
Shift Baru: F
Shift Lama: D
```

## 1. Routing

### 1.1 Spesifikasi Routing

Halaman yang akan dirender pertama kali oleh aplikasi adalah `/` atau root. Namun, ketika mengakses halaman tersebut, user akan diredirect/diteruskan ke halaman `/login`. Halaman login menggunakan `module login`.

```ts
const routes: Routes = [
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then((m) => m.HomePageModule),
    canActivate: [authGuard],
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () => import("./login/login.module").then((m) => m.LoginPageModule),
    canActivate: [autoLoginGuard],
  },
];
```

### 1.2 Auth Guard > Login

Jika user sudah `login`, maka akan diarahkan ke halaman `/home`. Jika belum `login`, maka akan tetap berada di halaman `login`.

```ts
export const autoLoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.authenticationState.pipe(
    filter((val) => val !== null),
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigateByUrl("/home", { replaceUrl: true });
        return true;
      } else {
        return true;
      }
    })
  );
};
```

## 2. Login

### 2.1 Halaman Login

Karena halaman `login` menggunakan modul `login`, modul `login` memiliki `declaration` bernama `LoginPage` yang makan declaration tersebut memiliki halaman `html login`. Halaman ini berisi UI `login`

Halaman `Login` dirender oleh kode html pada file `src\app\login\login.page.html`. Di Halaman login, terdapat 3 tombol input, 2 dengan jenis input text 1 input button.

Berikut adalah kodenya.

```html
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>Login</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">Login</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-item lines="full">
    <ion-label position="floating">Username</ion-label>
    <ion-input type="text" [(ngModel)]="username" required="required"></ion-input>
  </ion-item>
  <ion-item lines="full">
    <ion-label position="floating">Password</ion-label>
    <ion-input type="password" [(ngModel)]="password" required="required"></ion-input>
  </ion-item>
  <ion-row>
    <ion-col>
      <ion-button type="submit" color="primary" expand="block" (click)="login()">Login</ion-button>
    </ion-col>
  </ion-row>
</ion-content>
```

![Halaman Login](./snapshots/1_login.png)

Field yang ada pada halaman `login` dihandle oleh atribut yang dimiliki oleh `LoginPage`, yaitu `username`, dan `password`. Semua field memiliki validasi `required`, sehingga perlu diisi. Untuk submit dengan menekan tombol `Login`. Button ini akan mentrigger fungsi `login()` pada `LoginPage`.

```ts
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  username: any;
  password: any;
  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit() {}

  login() {
    if (this.username != null && this.password != null) {
      const data = {
        username: this.username,
        password: this.password,
      };
      this.authService.postMethod(data, "login.php").subscribe({
        next: (res) => {
          console.log({ res });
          if (res.status_login == "berhasil") {
            this.authService.saveData(res.token, res.username);
            this.username = "";
            this.password = "";
            this.router.navigateByUrl("/home");
          } else {
            this.authService.notifikasi("Username atau Password Salah");
          }
        },
        error: (e) => {
          this.authService.notifikasi("Login Gagal Periksa Koneksi Internet Anda");
        },
      });
    } else {
      this.authService.notifikasi("Username atau Password Tidak Boleh Kosong");
    }
  }
}
```

Jika username atau password kosong, maka memunculkan pop up Notifikasi dengan pesan `Username atau Password Tidak Boleh Kosong`.

![Pup Up Username/Password Kosong](./snapshots/username_password_kosong.png)

Jika berhasil maka melakukan fetch data user ke API, lalu mencocokkan data. Jika username atau password salah, maka muncul notifikasi `Username atau Password Salah`, jika terdapat error maka pesan yang diberikan adalah `Login Gagal Periksa Koneksi Internet Anda`.

Namun, jika berhasil akan menyimpan data user secara temporal, menyimpan state `isAuthenticated` menjadi `true` dan diarahkan ke halaman `/home`.

## 2. Home

Pada konfigurasi routing, modul `home` memiliki guard berupa Home Guard. Berikut adalah kodenya. Jika state user, yaitu

```ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.authenticationState.pipe(
    filter((val) => val !== null),
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigateByUrl("/login", { replaceUrl: true });
        return true;
      }
    })
  );
};
```

Halaman home merupakan modul dari `home`. Modul ini memiliki `declaration` berupa `HomePage`. `HomePage` memiliki halaman `html/template` yaitu `html home`.

Halaman `Home` dirender oleh kode html pada file `src\app\home\home.page.html`.

```html
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title> Home App </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">Home App</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-item (click)="logout()">
    <ion-icon slot="start" ios="exit-outline" md="exit-sharp"></ion-icon>
    <ion-label>Logout</ion-label>
  </ion-item>
  <hr />
  Selamat datang {{ nama }}
</ion-content>
```

![Halaman Home](./snapshots/2_homepage.png)

Di halaman ini terdapat pesan `Selamat Datang {nama user}` serta tombol `Logout` untuk keluar dari aplikasi. Jika tombol `Logout` diklik akan mentrigger fungsi `logout` pada class `HomePage`.

Fungsi ini akan mengubah state `isAuthenticated` menjadi `false` dan menghapus data autentikasi. Setelah itu diarahkan ke halaman login karena tidak memenuhi kondisi pada Home Guard.

```ts
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  nama = "";
  constructor(private authService: AuthenticationService, private router: Router) {
    this.nama = this.authService.nama;
  }

  ngOnInit() {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}
```
