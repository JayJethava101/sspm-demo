import { Injectable } from '@nestjs/common';
import { CognitoService } from '../cognito/cognito.service';
import { SignUpDto } from './dto/signup.dto';
import { ConfirmSignUpDto } from './dto/confirm-signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(private readonly cognitoService: CognitoService) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, name } = signUpDto;
    
    const userAttributes = [
      {
        Name: 'name',
        Value: name,
      },
      {
        Name: 'email',
        Value: email,
      },
    ];

    return this.cognitoService.signUp(email, password, userAttributes);
  }

  async confirmSignUp(confirmSignUpDto: ConfirmSignUpDto) {
    const { email, confirmationCode } = confirmSignUpDto;
    return this.cognitoService.confirmSignUp(email, confirmationCode);
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    return this.cognitoService.signIn(email, password);
  }

  async forgotPassword(email: string) {
    return this.cognitoService.forgotPassword(email);
  }

  async confirmForgotPassword(email: string, password: string, confirmationCode: string) {
    return this.cognitoService.confirmForgotPassword(email, password, confirmationCode);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { email, currentPassword, newPassword } = changePasswordDto;
    return this.cognitoService.changePassword(email, currentPassword, newPassword);
  }
  
}