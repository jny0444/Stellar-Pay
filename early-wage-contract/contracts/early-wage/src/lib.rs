#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Map, Symbol};

#[derive(Clone)]
#[contracttype]
pub struct Employee {
    employer: Address,
    salary_per_month: i128,
    emp_id: Symbol,
}

#[contract]
pub struct SalaryAdvanceContract;

#[contractimpl]
impl SalaryAdvanceContract {
    pub fn init_vault(env: Env) {
        env.storage()
            .instance()
            .set(&symbol_short!("vaultbal"), &0i128);
    }

    pub fn register_employer(env: Env, employer: Address, company_name: Symbol) {
        let mut employers: Map<Address, Symbol> = env
            .storage()
            .instance()
            .get(&symbol_short!("employers"))
            .unwrap_or(Map::new(&env));
        employers.set(employer, company_name);
        env.storage()
            .instance()
            .set(&symbol_short!("employers"), &employers);
    }

    pub fn register_employee(
        env: Env,
        employee: Address,
        employer: Address,
        emp_id: Symbol,
        salary_per_month: i128,
    ) {
        let mut employees: Map<Address, Employee> = env
            .storage()
            .instance()
            .get(&symbol_short!("employees"))
            .unwrap_or(Map::new(&env));
        let new_employee = Employee {
            employer,
            salary_per_month,
            emp_id,
        };
        employees.set(employee, new_employee);
        env.storage()
            .instance()
            .set(&symbol_short!("employees"), &employees);
    }

    pub fn deposit_to_vault(env: Env, amount: i128) {
        let mut vault_balance: i128 = env
            .storage()
            .instance()
            .get(&symbol_short!("vaultbal"))
            .unwrap_or(0i128);
        vault_balance += amount;
        env.storage()
            .instance()
            .set(&symbol_short!("vaultbal"), &vault_balance);
    }

    pub fn request_advance(env: Env, employee: Address, amount: i128) {
        let mut employees: Map<Address, Employee> = env
            .storage()
            .instance()
            .get(&symbol_short!("employees"))
            .unwrap();
        let mut vault_balance: i128 = env
            .storage()
            .instance()
            .get(&symbol_short!("vaultbal"))
            .unwrap();
        let mut emp = employees.get(employee.clone()).unwrap();
        let fee = amount * 125 / 10000;
        let total_deduction = amount + fee;
        if emp.salary_per_month < total_deduction {
            panic!("Insufficient salary to cover requested amount plus fee");
        }
        if vault_balance < amount {
            panic!("Insufficient vault balance");
        }
        emp.salary_per_month -= total_deduction;
        vault_balance -= amount;
        employees.set(employee, emp);
        env.storage()
            .instance()
            .set(&symbol_short!("employees"), &employees);
        env.storage()
            .instance()
            .set(&symbol_short!("vaultbal"), &vault_balance);
    }

    pub fn get_employee(env: Env, employee: Address) -> Employee {
        let employees: Map<Address, Employee> = env
            .storage()
            .instance()
            .get(&symbol_short!("employees"))
            .unwrap();
        employees.get(employee).unwrap()
    }

    pub fn get_employer(env: Env, employer: Address) -> Symbol {
        let employers: Map<Address, Symbol> = env
            .storage()
            .instance()
            .get(&symbol_short!("employers"))
            .unwrap();
        employers.get(employer).unwrap()
    }

    pub fn get_vault_balance(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&symbol_short!("vaultbal"))
            .unwrap_or(0i128)
    }
}

mod test;
