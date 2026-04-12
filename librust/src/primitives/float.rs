use crate::get_f64;

#[derive(Default)]
pub struct NzFloat {
    _value: f64,
}

impl NzFloat {
    pub fn new(key: &str) -> Self {
        unsafe {
            NzFloat {
                _value: get_f64(key, 0.),
                ..Default::default()
            }
        }
    }

    pub fn value(&mut self) -> &f64 {
        &self._value
    }
}
