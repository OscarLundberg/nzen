use crate::get_str;

#[derive(Default)]
pub struct NzString {
    _value: String,
}

impl NzString {
    pub fn new(key: &str) -> Self {
        unsafe {
            NzString {
                _value: get_str(key, ""),
                ..Default::default()
            }
        }
    }

    pub fn value(&mut self) -> &String {
        &self._value
    }
}
