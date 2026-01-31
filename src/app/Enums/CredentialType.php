<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Defines the types of authentication credentials supported by the application.
 */
enum CredentialType: string
{
    case NoAuth = 'no_auth';
    case BasicAuth = 'basic_auth';
    case ApiToken = 'api_token';
    case BearerToken = 'bearer_token';
    case Certificate = 'certificate';
    case SecretText = 'secret_text';
    case SshKey = 'ssh_key';
    case OAuth2 = 'oauth2';
    case AwsIam = 'aws_iam';
    case K8sServiceAccount = 'k8s_service_account';
    case GpgKey = 'gpg_key';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Retrieves the label corresponding to the authentication method represented by the current instance.
     *
     * @return string The label of the authentication method.
     */
    public function label(): string
    {
        return match ($this) {
            self::NoAuth => 'No Authentication',
            self::BasicAuth => 'Basic Auth (Username/Password)',
            self::ApiToken => 'API Token',
            self::BearerToken => 'Bearer Token',
            self::Certificate => 'SSL/TLS Certificate',
            self::SecretText => 'Secret Text',
            self::SshKey => 'SSH Key',
            self::OAuth2 => 'OAuth 2.0 Client',
            self::AwsIam => 'AWS IAM Credentials',
            self::K8sServiceAccount => 'Kubernetes Service Account',
            self::GpgKey => 'GPG Key',
        };
    }
}
