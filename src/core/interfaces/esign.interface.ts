export interface OAuthResponse {
    accessToken: string;
    tokenType: string;
    refreshToken: string;
    expiresIn: number
}