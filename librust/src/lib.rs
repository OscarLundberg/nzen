use wasm_bindgen::prelude::*;

mod primitives;

#[wasm_bindgen]
unsafe extern "C" {
    pub unsafe fn get_f64(s: &str, initial: f64) -> f64;
    pub unsafe fn set_f64(s: &str, val: f64) -> f64;

    pub unsafe fn get_bool(s: &str, initial: bool) -> bool;
    pub unsafe fn set_bool(s: &str, val: bool) -> bool;

    pub unsafe fn get_str(s: &str, initial: &str) -> String;
    pub unsafe fn set_str(s: &str, val: &str) -> String;
}

pub trait NzModule {
    fn setup() {}
    fn update() {}
}
