import { Module } from '@nestjs/common';
import { SupplierProductService } from './supplier_product.service';
import { SupplierProductController } from './supplier_product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier_Product, supplierProductSchema } from './schema/supplier_product.schema';
import { SupplierLocationModule } from '../supplier_location/supplier_location.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Supplier_Product.name,
        schema: supplierProductSchema,
        collection: Supplier_Product.name.toLowerCase()
      }
    ]),
    SupplierLocationModule
  ],
  controllers: [SupplierProductController],
  providers: [SupplierProductService]
})
export class SupplierProductModule { }
