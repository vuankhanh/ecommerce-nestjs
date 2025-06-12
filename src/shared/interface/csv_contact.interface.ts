import { ICustomer } from "./customer.interface";

export interface IJsonContact {
  "First Name": string;
  "Middle Name": string;
  "Last Name": string;
  "Phonetic First Name": string;
  "Phonetic Middle Name": string;
  "Phonetic Last Name": string;
  "Name Prefix": string;
  "Name Suffix": string;
  "Nickname": string;
  "File As": string;
  "Organization Name": string;
  "Organization Title": string;
  "Organization Department": string;
  "Birthday": string;
  "Notes": string;
  "Photo": string;
  "Labels": string;
  "Phone 1 - Label": string;
  "Phone 1 - Value": string;
  "Phone 2 - Label": string;
  "Phone 2 - Value": string;
}

export interface ICsvContact {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneticFirstName: string;
  phoneticMiddleName: string;
  phoneticLastName: string;
  namePrefix: string;
  nameSuffix: string;
  nickname: string;
  fileAs: string;
  organizationName: string;
  organizationTitle: string;
  organizationDepartment: string;
  birthday: string;
  notes: string;
  photo: string;
  labels: string;
  phone1Label: string;
  phone1Value: string;
  phone2Label: string;
  phone2Value: string;
}

export class CsvContact implements ICsvContact {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneticFirstName: string;
  phoneticMiddleName: string;
  phoneticLastName: string;
  namePrefix: string;
  nameSuffix: string;
  nickname: string;
  fileAs: string;
  organizationName: string;
  organizationTitle: string;
  organizationDepartment: string;
  birthday: string;
  notes: string;
  photo: string;
  labels: string;
  phone1Label: string;
  phone1Value: string;
  phone2Label: string;
  phone2Value: string;
  constructor(jsonContact: IJsonContact) {
    this.firstName = jsonContact["First Name"];
    this.middleName = jsonContact["Middle Name"];
    this.lastName = jsonContact["Last Name"];
    this.phoneticFirstName = jsonContact["Phonetic First Name"];
    this.phoneticMiddleName = jsonContact["Phonetic Middle Name"];
    this.phoneticLastName = jsonContact["Phonetic Last Name"];
    this.namePrefix = jsonContact["Name Prefix"];
    this.nameSuffix = jsonContact["Name Suffix"];
    this.nickname = jsonContact["Nickname"];
    this.fileAs = jsonContact["File As"];
    this.organizationName = jsonContact["Organization Name"];
    this.organizationTitle = jsonContact["Organization Title"];
    this.organizationDepartment = jsonContact["Organization Department"];
    this.birthday = jsonContact["Birthday"];
    this.notes = jsonContact["Notes"];
    this.photo = jsonContact["Photo"];
    this.labels = jsonContact["Labels"];
    this.phone1Label = jsonContact["Phone 1 - Label"];
    this.phone1Value = jsonContact["Phone 1 - Value"];
    this.phone2Label = jsonContact["Phone 2 - Label"];
    this.phone2Value = jsonContact["Phone 2 - Value"];
  }

  transform(): ICustomer {
    return {
      name: `${this.firstName} ${this.lastName}`,
      phoneNumber: this.phone1Value || this.phone2Value,
      address: this.organizationName,
      email: '',
      dob: this.birthday,
      company: this.organizationName,
      note: this.notes,
      level: this.organizationName ? 'VIP' : 'NORMAL'
    } as ICustomer;
  }
}