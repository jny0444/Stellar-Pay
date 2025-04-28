#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[contract]
pub struct EarlyWageContract;

#[contracttype]
pub struct EmployeeDetails {
    pub emp_id: u128,
    pub wallet: Address,
}

#[contractimpl]
impl EarlyWageContract {
    pub fn deposit_to_vault(e: &Env, from: Address, amount: i128, token: Address) {
        from.require_auth();

        token::TokenClient::new(e, &token).transfer(&from, &e.current_contract_address(), &amount);
    }

    pub fn request_advance(e: &Env) {}

    pub fn vault_balance(e: &Env) -> i128 {
        token::TokenClient::new(e, &e.current_contract_address())
            .balance(&e.current_contract_address())
    }
}
