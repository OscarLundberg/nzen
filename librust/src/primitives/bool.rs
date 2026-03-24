use crate::get_bool;

#[derive(Default)]
pub struct NzBool {
    _value: bool,
}

impl NzBool {
    pub fn new(key: &str) -> Self {
        unsafe {
            NzBool {
                _value: get_bool(key, false),
                ..Default::default()
            }
        }
    }

    pub fn value(&mut self) -> &bool {
        &self._value
    }
}
