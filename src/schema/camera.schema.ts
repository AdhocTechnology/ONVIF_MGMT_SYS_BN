import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
@Schema()
export class Camera {
   @Prop()
   ipCamera: string;
   @Prop()
   username: string;
   @Prop()
   password: string;
   @Prop()
   warrantyExp : string;
   @Prop()
   status: boolean;
   @Prop()
   model: string;
   @Prop()
   brand: string;
   @Prop()
   createAt: Date;
}
export const CameraSchema = SchemaFactory.createForClass(Camera);
