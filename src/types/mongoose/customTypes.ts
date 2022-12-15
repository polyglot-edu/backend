import mongoose from "mongoose";

export class Int8 extends mongoose.SchemaType {
  constructor(key: string, options: mongoose.AnyObject | undefined) {
    super(key, options, 'Int8');
  }

  // `cast()` takes a parameter that can be anything. You need to
  // validate the provided `val` and throw a `CastError` if you
  // can't convert it.
  cast(val: string) {
    let _val = Number(val);
    if (isNaN(_val)) {
      throw new Error('Int8: ' + val + ' is not a number');
    }
    _val = Math.round(_val);
    if (_val < -0x80 || _val > 0x7F) {
      throw new Error('Int8: ' + val +
        ' is outside of the range of valid 8-bit ints');
    }
    return _val;
  }
}

mongoose.Schema.Types.Int8 = Int8;