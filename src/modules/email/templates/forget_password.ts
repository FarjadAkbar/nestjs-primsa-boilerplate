import { ForgetPasswordPayload } from '../types';

export default ({ name, code }: ForgetPasswordPayload) => {
    return `
        <h1>Hello, ${name}</h1>
        <h5>Please use the verification code below:</h5>
        <h4>${code}</h4>
    `;
};
