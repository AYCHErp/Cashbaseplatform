import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController, LoadingController } from '@ionic/angular';
import { PaDataService } from 'src/app/services/padata.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public isLoggedIn = false;
  public username: string;
  private deletePasswordAlert: HTMLIonAlertElement;
  private loadingDelete: HTMLIonLoadingElement;

  constructor(
    private popoverController: PopoverController,
    private paData: PaDataService,
    private translate: TranslateService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
  }

  async ngOnInit() {
    this.isLoggedIn = this.paData.hasAccount;
    this.username = await this.paData.getUsername();
  }

  close() {
    this.popoverController.dismiss();
  }

  logout() {
    this.paData.logout();
    this.close();
    window.location.reload();
  }

  async deletePrompt() {
    this.deletePasswordAlert = await this.alertController.create({
      header: this.translate.instant('account.delete-account-header'),
      message: this.translate.instant('account.delete-account-message'),
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: this.translate.instant('account.enter-password')
        },
      ],
      buttons: [
        {
          role: 'cancel',
          text: this.translate.instant('shared.cancel-button'),
        },
        {
          text: this.translate.instant('shared.submit-button'),
          handler: (data) => {
            if (!data || !data.password) {
              const passowordInput: HTMLInputElement = this.deletePasswordAlert.querySelector('[type=password]');
              if (passowordInput) {
                passowordInput.focus();
              }

              return false;
            }

            this.presentLoadingDelete();
            this.deleteIdentity(data.password);

            return false;
          },
        },
      ],
    });
    await this.deletePasswordAlert.present();
  }

  private deleteIdentity(password: string) {
    return this.paData.deleteIdentity(password)
      .then(
        () => {
          this.loadingDelete.dismiss();
          this.deletePasswordAlert.dismiss();
          this.showDeleteResult(this.translate.instant('account.delete-succes'), true);
        },
        (error) => {
          this.loadingDelete.dismiss();
          if (error.status === 401) {
            console.error('Incorrect credentials: ', error);
            this.showDeleteResult(this.translate.instant('personal.login-identity.incorrect-credentials'));
          } else if (error.status === 400) {
            console.error('Account already deleted ', error);
            this.showDeleteResult(this.translate.instant('account.delete-success'));
          } else {
            console.error(error);
            this.showDeleteResult(this.translate.instant('account.delete-fail'));
          }
        }
      );
  }

  public async presentLoadingDelete() {
    this.loadingDelete = await this.loadingController.create({
    });
    await this.loadingDelete.present();
  }

  public async showDeleteResult(resultMessage: string, logoutOnDismiss = false) {
    const alert = await this.alertController.create({
      message: resultMessage,
      buttons: [
        {
          text: this.translate.instant('shared.close-button'),
        },
      ],
    });

    if (logoutOnDismiss) {
      alert.onDidDismiss().then(() => this.logout());
    }

    await alert.present();
  }
}
