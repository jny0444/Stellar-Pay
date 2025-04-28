#[cfg(test)]
extern crate std;
use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_register_employer_and_employee() {
    let env = Env::default();
    let contract = SalaryAdvanceContract;
    contract.init_vault(env.clone());

    let employer = Address::random(&env);
    let employee = Address::random(&env);

    contract.register_employer(env.clone(), employer.clone(), symbol_short!("CompABC"));
    contract.register_employee(
        env.clone(),
        employee.clone(),
        employer.clone(),
        symbol_short!("EMP123"),
        10000,
    );

    let stored_employer = contract.get_employer(env.clone(), employer.clone());
    assert_eq!(stored_employer, symbol_short!("CompABC"));

    let stored_employee = contract.get_employee(env.clone(), employee.clone());
    assert_eq!(stored_employee.salary_per_month, 10000);
    assert_eq!(stored_employee.employer, employer);
}

#[test]
fn test_deposit_and_request_advance() {
    let env = Env::default();
    let contract = SalaryAdvanceContract;
    contract.init_vault(env.clone());

    let employer = Address::random(&env);
    let employee = Address::random(&env);

    contract.register_employer(env.clone(), employer.clone(), symbol_short!("CompDEF"));
    contract.register_employee(
        env.clone(),
        employee.clone(),
        employer.clone(),
        symbol_short!("EMP456"),
        20000,
    );

    contract.deposit_to_vault(env.clone(), 5000);

    let vault_before = contract.get_vault_balance(env.clone());
    assert_eq!(vault_before, 5000);

    contract.request_advance(env.clone(), employee.clone(), 4000);

    let vault_after = contract.get_vault_balance(env.clone());
    assert_eq!(vault_after, 1000);

    let updated_employee = contract.get_employee(env.clone(), employee.clone());
    let expected_salary = 20000 - (4000 + (4000 * 125 / 10000));
    assert_eq!(updated_employee.salary_per_month, expected_salary);
}

#[test]
#[should_panic(expected = "Insufficient salary to cover requested amount plus fee")]
fn test_insufficient_salary_for_request() {
    let env = Env::default();
    let contract = SalaryAdvanceContract;
    contract.init_vault(env.clone());

    let employer = Address::random(&env);
    let employee = Address::random(&env);

    contract.register_employer(env.clone(), employer.clone(), symbol_short!("CompGHI"));
    contract.register_employee(
        env.clone(),
        employee.clone(),
        employer.clone(),
        symbol_short!("EMP789"),
        1000,
    );

    contract.deposit_to_vault(env.clone(), 2000);

    contract.request_advance(env.clone(), employee.clone(), 950);
}

#[test]
#[should_panic(expected = "Insufficient vault balance")]
fn test_insufficient_vault_for_request() {
    let env = Env::default();
    let contract = SalaryAdvanceContract;
    contract.init_vault(env.clone());

    let employer = Address::random(&env);
    let employee = Address::random(&env);

    contract.register_employer(env.clone(), employer.clone(), symbol_short!("CompJKL"));
    contract.register_employee(
        env.clone(),
        employee.clone(),
        employer.clone(),
        symbol_short!("EMP321"),
        5000,
    );

    contract.deposit_to_vault(env.clone(), 1000);

    contract.request_advance(env.clone(), employee.clone(), 3000);
}
