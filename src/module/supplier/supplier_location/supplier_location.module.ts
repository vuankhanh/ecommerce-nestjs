import { Module } from '@nestjs/common';
import { SupplierLocationController } from './supplier_location.controller';
import { SupplierLocationService } from './supplier_location.service';
import { VnPublicApisModule } from '../../vn-public-apis/vn-public-apis.module';
import { CustomLoggerModule } from '../../custom_logger/custom_logger.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier_Location, supplierLocationSchema } from './schema/supplier_location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Supplier_Location.name,
        schema: supplierLocationSchema,
        collection: Supplier_Location.name.toLowerCase()
      }
    ]),
    CustomLoggerModule,
    VnPublicApisModule
  ],
  controllers: [SupplierLocationController],
  providers: [SupplierLocationService],
  exports: [SupplierLocationService]
})
export class SupplierLocationModule { }
