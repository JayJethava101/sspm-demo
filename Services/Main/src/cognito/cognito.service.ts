import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ChangePasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'crypto';
import {
  UserNotFoundException,
  UserNotConfirmedException,
  InvalidPasswordException,
  NotAuthorizedException,
  UsernameExistsException,
  CodeMismatchException,
  ExpiredCodeException,
  LimitExceededException,
  TooManyRequestsException,
  InvalidParameterException
} from '../auth/exceptions/cognito-exceptions';

@Injectable()
export class CognitoService {
  private readonly cognitoClient: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.userPoolId = this.configService.get<string>('AWS_COGNITO_USER_POOL_ID') || '';
    this.clientId = this.configService.get<string>('AWS_COGNITO_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('AWS_COGNITO_CLIENT_SECRET') || '';
    
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  /**
   * Calculate the secret hash for AWS Cognito
   */
  private calculateSecretHash(username: string): string {
    // if (!this.clientSecret) return null;
    
    return createHmac('sha256', this.clientSecret)
      .update(username + this.clientId)
      .digest('base64');
  }

  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, userAttributes: { Name: string; Value: string }[]) {
    try {
      const secretHash = this.calculateSecretHash(email);
      
      const command = new SignUpCommand({
        ClientId: this.clientId,
        Username: email,
        Password: password,
        SecretHash: secretHash,
        UserAttributes: userAttributes,
      });

      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      // Map AWS SDK errors to our custom exceptions
      if (error.name === 'UsernameExistsException') {
        throw new UsernameExistsException();
      } else if (error.name === 'InvalidPasswordException') {
        throw new InvalidPasswordException();
      } else if (error.name === 'InvalidParameterException') {
        throw new InvalidParameterException(error.message);
      } else if (error.name === 'TooManyRequestsException') {
        throw new TooManyRequestsException();
      } 
      // If not a known error, re-throw the original
      throw error;
    }
  }

  /**
   * Confirm sign up with verification code
   */
  async confirmSignUp(email: string, confirmationCode: string) {
    try {
      const secretHash = this.calculateSecretHash(email);
      
      const command = new ConfirmSignUpCommand({
        ClientId: this.clientId,
        Username: email,
        ConfirmationCode: confirmationCode,
        SecretHash: secretHash,
      });

      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      // Map AWS SDK errors to our custom exceptions
      if (error.name === 'UsernameExistsException') {
        throw new UsernameExistsException();
      } else if (error.name === 'InvalidPasswordException') {
        throw new InvalidPasswordException();
      } else if (error.name === 'InvalidParameterException') {
        throw new InvalidParameterException(error.message);
      } else if (error.name === 'TooManyRequestsException') {
        throw new TooManyRequestsException();
      } 
      // If not a known error, re-throw the original
      throw error;
    }
  }

  /**
   * Sign in a user
   */
  async signIn(email: string, password: string) {
    try {
      const secretHash = this.calculateSecretHash(email);
      
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: secretHash,
        },
      });

      const response = await this.cognitoClient.send(command);
      return response;
    }catch (error) {
      // Map AWS SDK errors to our custom exceptions
      if (error.name === 'UsernameExistsException') {
        throw new UsernameExistsException();
      } else if (error.name === 'InvalidPasswordException') {
        throw new InvalidPasswordException();
      } else if (error.name === 'InvalidParameterException') {
        throw new InvalidParameterException(error.message);
      } else if (error.name === 'TooManyRequestsException') {
        throw new TooManyRequestsException();
      } 
      // If not a known error, re-throw the original
      throw error;
    }
  }

  /**
   * Initiate forgot password flow
   */
  async forgotPassword(email: string) {
    try {
      const secretHash = this.calculateSecretHash(email);
      
      const command = new ForgotPasswordCommand({
        ClientId: this.clientId,
        Username: email,
        SecretHash: secretHash,
      });

      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      // Map AWS SDK errors to our custom exceptions
      if (error.name === 'UsernameExistsException') {
        throw new UsernameExistsException();
      } else if (error.name === 'InvalidPasswordException') {
        throw new InvalidPasswordException();
      } else if (error.name === 'InvalidParameterException') {
        throw new InvalidParameterException(error.message);
      } else if (error.name === 'TooManyRequestsException') {
        throw new TooManyRequestsException();
      } 
      // If not a known error, re-throw the original
      throw error;
    }
  }

  /**
   * Confirm new password with confirmation code
   */
  async confirmForgotPassword(email: string, password: string, confirmationCode: string) {
    try {
      const secretHash = this.calculateSecretHash(email);
      
      const command = new ConfirmForgotPasswordCommand({
        ClientId: this.clientId,
        Username: email,
        Password: password,
        ConfirmationCode: confirmationCode,
        SecretHash: secretHash,
      });

      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      // Map AWS SDK errors to our custom exceptions
      if (error.name === 'UsernameExistsException') {
        throw new UsernameExistsException();
      } else if (error.name === 'InvalidPasswordException') {
        throw new InvalidPasswordException();
      } else if (error.name === 'InvalidParameterException') {
        throw new InvalidParameterException(error.message);
      } else if (error.name === 'TooManyRequestsException') {
        throw new TooManyRequestsException();
      } 
      // If not a known error, re-throw the original
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(email: string, currentPassword: string, newPassword: string) {
    try {
      // First authenticate the user with current password
      const authResponse = await this.signIn(email, currentPassword);
      
      if (!authResponse.AuthenticationResult) {
        throw new Error('Authentication failed');
      }
      
      const { AccessToken } = authResponse.AuthenticationResult;
      
      // Change password using the access token
      const command = new ChangePasswordCommand({
        AccessToken,
        PreviousPassword: currentPassword,
        ProposedPassword: newPassword,
      });

      const response = await this.cognitoClient.send(command);
      return response;
    }catch (error) {
      // Map AWS SDK errors to our custom exceptions
      if (error.name === 'UsernameExistsException') {
        throw new UsernameExistsException();
      } else if (error.name === 'InvalidPasswordException') {
        throw new InvalidPasswordException();
      } else if (error.name === 'InvalidParameterException') {
        throw new InvalidParameterException(error.message);
      } else if (error.name === 'TooManyRequestsException') {
        throw new TooManyRequestsException();
      } 
      // If not a known error, re-throw the original
      throw error;
    }
  }
}