import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { ICamera } from "src/interface/camera.interface";
@Schema()
export class HistoryCamera {
   @Prop()
   _uuid: string;
   @Prop()
    cameras : ICamera[];
   @Prop()
   createAt: Date;
}
export const HistoryCameraSchema = SchemaFactory.createForClass(HistoryCamera);
