import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { ViewController } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
})
export class ScanQrPage implements OnInit {

  private isBackMode = true;
  private isFlashLightOn = false;
  private scanSub: any;
  isValidationMeeting = false;

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public qrScanner: QRScanner,
    public storage: Storage,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public router: Router
  ) {
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.getOrigins();
    }, 200);

    this.showCamera();
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          console.log('Camera Permission Given');

          // start scanning
          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('camera', text);
            this.qrScanner.hide(); // hide camera preview
            this.scanSub.unsubscribe(); // stop scanning
            this.hideCamera();
            this.startMeeting(text);
          });

          // show camera preview
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          console.log('Camera permission denied');
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          console.log('Permission denied for this runtime.');
        }
      })
      .catch((e: any) => {
        console.log('Error is', e);
        // this.loader.dismiss();
      });
  }

  closeModal() {
    this.router.navigate(['/tabs/personal']);
    this.qrScanner.hide(); // hide camera preview
    // this.scanSub.unsubscribe(); // stop scanning
    this.hideCamera();
  }
  getOrigins() {
    this.isValidationMeeting = true;
  }

  toggleFlashLight() {
    this.isFlashLightOn = !this.isFlashLightOn;
    if (this.isFlashLightOn) {
      this.qrScanner.enableLight();
    } else {
      this.qrScanner.disableLight();
    }
  }
  toggleCamera() {
    this.isBackMode = !this.isBackMode;
    if (this.isBackMode) {
      this.qrScanner.useFrontCamera();
    } else {
      this.qrScanner.useBackCamera();
    }
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).style.background = 'none transparent';
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).style.background = '';
  }

  startMeeting(did) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        did: JSON.stringify(did)
      }
    };
    this.router.navigate(['/tabs/personal'], navigationExtras);
  }

  ngOnInit() {
  }

}
