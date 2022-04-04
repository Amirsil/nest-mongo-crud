import { prop } from "@typegoose/typegoose";

export class Cat {
  public _id?: string;

  @prop({ required: true, unique: true })
  public name: string;

  @prop({ required: true })
  public tailLength: number;

  @prop()
  public image?: string;
}
