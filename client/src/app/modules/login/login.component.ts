import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {auth} from 'firebase/app';
import {from, throwError} from 'rxjs';
import {catchError, filter, switchMap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../environments/static-config';
import {StateService} from '../../shared/services/state/state.service';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
    public fb: FormBuilder,
    private snackBar: MatSnackBar,
    private state: StateService
  ) {}

  @ViewChild('password', {static: true}) passwordField: ElementRef;

  loginForm: FormGroup;
  staticConfig = STATIC_CONFIG;

  ngOnInit() {
    this.afAuth.user
      .pipe(
        filter(user => !!user),
        switchMap(user => user.getIdTokenResult())
      )
      .subscribe(res => {
        /**
         * If the user has any kind of role we allow
         * access to the dashboard
         */
        if (res.claims.role) {
          this.state.role = res.claims.role;
          this.router.navigate(['/dashboard']);
        } else {
          this.afAuth.auth.signOut();
          this.snackBar.open(
            'Access to platform denied. Please contact an administrator.',
            'Dismiss',
            {duration: 2000}
          );
        }
      });

    this.buildForm();
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginEmail() {
    return () => {
      const data = this.loginForm.getRawValue();

      return from(
        this.afAuth.auth.signInWithEmailAndPassword(
          data.emailLogin,
          data.passwordLogin
        )
      ).pipe(
        notify({
          success: 'You are now logged in',
          error:
            'The email and password you entered did not match our records. Please double-check and try again.'
        }),
        catchError(error => {
          this.loginForm.get('passwordLogin').reset();
          this.passwordField.nativeElement.focus();
          return throwError(error);
        })
      );
    };
  }

  private buildForm() {
    this.loginForm = this.fb.group({
      emailLogin: ['', [Validators.required, Validators.email]],
      passwordLogin: ['', Validators.required]
    });
  }
}
