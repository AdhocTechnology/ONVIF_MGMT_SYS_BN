import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
@Schema()
export class Scheduler {
   @Prop()
   timeHr: string;
   @Prop()
   timeMin : string;
   @Prop()
   createAt: Date;
}
export const SchedulerSchema = SchemaFactory.createForClass(Scheduler);
