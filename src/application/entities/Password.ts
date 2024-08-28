import { CryptoAdapter } from "../../infra/adapter/crypto";
import { PASSWORD_SALT } from "../constants/password";


export class Password {
    private _password: string;
    cryptoAdapter: CryptoAdapter;

    constructor(value: string) {
        this.cryptoAdapter = new CryptoAdapter();
        this._password = this.cryptoAdapter.hash(value, PASSWORD_SALT);
    }

    get value() {
        return this._password
    }

    public isTheSameValue(plainValue: string) {
        return this.cryptoAdapter.compare({ compareValue: plainValue, hashedValue: this._password });
    }
}