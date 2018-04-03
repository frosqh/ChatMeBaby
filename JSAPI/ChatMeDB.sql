CREATE TABLE User (
  UserID INT NOT NULL,
  UserName VARCHAR(50) NOT NULL,
  Mail VARCHAR(200) NOT NULL,
  Connected INT NOT NULL,
  FirstName VARCHAR(50) NULL,
  LastName VARCHAR(50) NULL,
  BirthDate DATE NULL,
  AvatarURI VARCHAR(200) NULL,
  Status INT NULL,
  Description TEXT NULL,
  PhoneNumber VARCHAR(12) NULL,
  Skype VARCHAR(50) NULL,
  PRIMARY KEY (
    UserID
  )
);

CREATE TABLE Preferences (PrefID INT NOT NULL,UserID INT NOT NULL,Theme INT NOT NULL,Display INT NOT NULL,PRIMARY KEY (PrefID));


CREATE TABLE Channel (
  ChannelID INT NOT NULL,
  Name VARCHAR(75) NOT NULL,
  CreationDate DATETIME NOT NULL,
  PRIMARY KEY (
    ChannelID
  )
);

CREATE TABLE Message (
  MessageID INT NOT NULL,
  UserID INT NOT NULL,
  ChannelID INT NOT NULL,
  Txt TEXT NOT NULL,
  SendDate DATETIME NOT NULL,
  PJ VARCHAR(200) NULL,
  PRIMARY KEY (
    MessageID
  )
);

CREATE TABLE Settings (
  SettingsID INT NOT NULL,
  ChannelID INT NOT NULL,
  Setting1 INT NOT NULL,
  PRIMARY KEY (
    SettingsID
  )
);

CREATE TABLE UserByChannel (
  ID INT NOT NULL,
  UserID INT NOT NULL,
  ChannelID INT NOT NULL,
  Power INT NOT NULL,
  Title VARCHAR(50) NULL,
  PRIMARY KEY (
    ID
  )
);

ALTER TABLE Preferences ADD CONSTRAINT fk_Preferences_UserID FOREIGN KEY(UserID)
REFERENCES User (UserID);

ALTER TABLE Message ADD CONSTRAINT fk_Message_UserID FOREIGN KEY(UserID)
REFERENCES User (UserID);

ALTER TABLE Message ADD CONSTRAINT fk_Message_ChannelID FOREIGN KEY(ChannelID)
REFERENCES Channel (ChannelID);

ALTER TABLE Settings ADD CONSTRAINT fk_Settings_ChannelID FOREIGN KEY(ChannelID)
REFERENCES Channel (ChannelID);

ALTER TABLE UserByChannel ADD CONSTRAINT fk_UserByChannel_UserID FOREIGN KEY(UserID)
REFERENCES User (UserID);

ALTER TABLE UserByChannel ADD CONSTRAINT fk_UserByChannel_ChannelID FOREIGN KEY(ChannelID)
REFERENCES Channel (ChannelID);