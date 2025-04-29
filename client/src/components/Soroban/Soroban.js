import { Address, BASE_FEE, Contract, nativeToScVal, Networks, Soroban } from "@stellar/stellar-sdk";

let rpcUrl = "https://soroban-testnet.stellar.org";
let contractAddressToken = "CDB5EWYMHLVBUCF34JKI6V53DLV6IKZPABNTPGXRR7L5XUVDBKE2ZSA3";
let contractAddressWage = "CAHEHF7DFQKQBBG6SRQF6U3P6WWDIIP6UAZXEPZAXMXYYYLIS7L7MJTN";

let accToScVal = (account) => {
    return new Address(account).toScVal();
}

let stringToScVal = (str) => {
    return nativeToScVal(str);
}

let numberToScVal = (num) => {
    return nativeToScVal(num, {value: "u128"});
}

let params = {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
}

async function contractInt(caller, functionName, values) {
    
}