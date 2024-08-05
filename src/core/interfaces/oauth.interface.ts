export type OAuthProviders = 'google' | 'apple' | 'facebook';

export type IOAuthTokenData = {
    id: string;
    name?: string;
    type: 'google' | 'apple' | 'facebook';
    email: string;
    imageUrl?: string
};

export default interface IOAuth {
    GetTokenData(token: string): Promise<IOAuthTokenData>;
}
