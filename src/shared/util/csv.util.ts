import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { CsvContact, IJsonContact } from '../interface/csv_contact.interface';
import { Customer } from 'src/module/customer/schema/customer.schema';
import { ICustomer } from '../interface/customer.interface';

export class CsvUtil {
  static async convertCsvToJson(buffer: Buffer): Promise<Array<IJsonContact>> {
    const results = [];

    return new Promise((resolve, reject) => {
      const stream = Readable.from(buffer.toString());

      stream.pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve(results);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  static transformArrJsonContactToArrCustomer(arrJsonContact: Array<IJsonContact>): Array<Customer> {
    return arrJsonContact
    .map(jsonContact => {
      const csvContact = new CsvContact(jsonContact);
      const customer: ICustomer = csvContact.transform();

      return new Customer(customer);
    })
    .filter(customer => customer.phoneNumber);
  }
}