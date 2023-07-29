import {Document } from 'mongoose';

export interface IForm extends Document {
  display: string;
  components: unknown[];
}
