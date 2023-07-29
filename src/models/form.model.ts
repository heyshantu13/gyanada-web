import mongoose, { Schema, Document } from 'mongoose';
import { IForm } from '../interface/IForm';


const formSchema: Schema<IForm> = new Schema({
  display: {
    type: String,
    required: true,
  },
  components: {
    type: Array,
    required: true,
  },
});
  
const Form = mongoose.model<IForm>('Form', formSchema);
  
export default Form;
  