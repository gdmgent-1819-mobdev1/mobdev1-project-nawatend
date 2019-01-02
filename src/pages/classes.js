export default class User {
  constructor(uid, firstName, lastName, email, telephoneNr, userType) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.telephoneNr = telephoneNr;
    this.userType = userType;
  }
}

export class Student extends User {
  constructor(
    uid,
    firstName,
    lastName,
    email,
    telephoneNr,
    userType,
    universityName,
    universityLong,
    universityLat,

  ) {
    super(uid, firstName, lastName, email, telephoneNr, userType);
    this.universityName = universityName;
    this.universityLong = universityLong;
    this.universityLat = universityLat;
  }
}

export class HomeOwner extends User {

}

export class Home {
  constructor(
    homeOwnerUid,
    homeKey,
    addressName,
    longtidute,
    latitude,
    rentPrice,
    insurancePrice,
    description,
    floor,
    maxTenant,
    furnitured = false,
    imageLink,
    totalHome,
    toilet,
    shower,
    bath,
    kitchen,
    type,
    size,
  ) {
    this.homeownerUID = homeOwnerUid;
    this.homeKey = homeKey;
    this.addressName = addressName;
    this.longtidute = longtidute;
    this.latitude = latitude;
    this.rentPrice = rentPrice;
    this.insurancePrice = insurancePrice;
    this.description = description;
    this.floor = floor;
    this.maxTenant = maxTenant;
    this.furnitured = furnitured;
    this.imageLink = imageLink;
    this.totalHome = totalHome;
    this.toilet = toilet;
    this.shower = shower;
    this.bath = bath;
    this.kitchen = kitchen;
    this.type = type;
    this.size = size;
  }
}
export class Message {
  constructor(messageText, messageFrom, messageTo, messageTime) {
    this.messageText = messageText;
    this.messageFrom = messageFrom;
    this.messageTo = messageTo;
    this.messageTime = messageTime;
  }
}
export class Conversation {
  constructor(conversationKey, fromUserID, toUserID, messages) {
    this.conversationKey = conversationKey;
    this.fromUserID = fromUserID;
    this.toUserID = toUserID;
    this.messages = messages;
  }
}
