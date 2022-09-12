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
   warrantyExp: string;
   @Prop()
   status: boolean;
   @Prop()
   model: string;
   @Prop()
   manufacturer: string;
   @Prop()
   serialNumber: number;
   @Prop()
   hardwareId: string;
   @Prop()
   firmwareVersion: string;
   @Prop()
   port?: number;
   @Prop()
   responseTime?: string;
   @Prop()
   createAt: Date;
}
export const CameraSchema = SchemaFactory.createForClass(Camera);
