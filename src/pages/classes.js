export default class User {
  constructor(uid, firstName, lastName, AddressCoordinate, email, telephoneNr) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.addressCoordinate = AddressCoordinate;

    this.telephoneNr = telephoneNr;
  }
}

export class Student extends User {
  constructor(
    uid,
    firstName,
    lastName,
    addressCoordinate,
    email,
    telephoneNr,
    universityName,
  ) {
    super(uid, firstName, lastName, addressCoordinate, email, telephoneNr);
    this.universityName = universityName;
  }
}

export class HomeOwner extends User {

}

export class Home {
  constructor(
    homeOwnerUid,
    homeKey,
    addressCoordinate,
    rentPrice,
    insurancePrice,
    description,
    floor,
    maxTenant,
    furnitured = false,
    images,
    totalHome,
    toilet,
    shower,
    bath,
    kitchen,
    type,
  ) {
    this.homeownerUID = homeOwnerUid;
    this.homeKey = homeKey;
    this.addressCoordinate = addressCoordinate;
    this.rentPrice = rentPrice;
    this.insurancePrice = insurancePrice;
    this.description = description;
    this.floor = floor;
    this.maxTenant = maxTenant;
    this.furnitured = furnitured;
    this.images = images;
    this.totalHome = totalHome;
    this.toilet = toilet;
    this.shower = shower;
    this.bath = bath;
    this.kitchen = kitchen;
    this.type = type;
  }
}

export class Message {
  constructor(conversationKey, messagekey, fromUserID, toUserID, messageText) {
    this.conversationKey = conversationKey;
    this.messageKey = messagekey;
    this.fromUserID = fromUserID;
    this.toUserID = toUserID;
    this.messageText = messageText;
  }
}
