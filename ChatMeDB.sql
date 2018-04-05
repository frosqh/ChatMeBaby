CREATE TABLE IF NOT EXISTS User (
  UserID INT NOT NULL,
  UserName VARCHAR(50) NOT NULL,
  Mail VARCHAR(200) NOT NULL,
  Connected INT NOT NULL,
  Password VARCHAR(50) NOT NULL,
  Confirmed INT NOT NULL,
  FirstName VARCHAR(50) NULL,
  LastName VARCHAR(50) NULL,
  BirthDate DATE NULL,
  AvatarURI VARCHAR(200) NULL, 
  Status INT NULL,
  Description TEXT NULL,
  PhoneNumber VARCHAR(12) NULL,
  City VARCHAR(100) NULL,
  Gender INT NULL,
  PRIMARY KEY (
    UserID
  )
);

CREATE TABLE IF NOT EXISTS Confirmation (
  ID VARCHAR(100) NOT NULL,
  UserID INT NOT NULL,
  PRIMARY KEY (
    ID
  )
);

CREATE TABLE IF NOT EXISTS Notification (
  ID INT NOT NULL,
  Txt TEXT NOT NULL,
  User INT NOT NULL,
  CreationDate DATETIME NOT NULL,
  Read INT NOT NULL,
  PRIMARY KEY (
    ID
  )
);

CREATE TABLE IF NOT EXISTS Friends ( 
  ID INT NOT NULL,
  UserA INT NOT NULL,
  UserB INT NOT NULL,
  CreationDate DATETIME NOT NULL,
  PRIMARY KEY (
    ID
  )
);

CREATE TABLE IF NOT EXISTS Preferences (PrefID INT NOT NULL,UserID INT NOT NULL,Theme INT NOT NULL,Display INT NOT NULL,PRIMARY KEY (PrefID));


CREATE TABLE IF NOT EXISTS Channel (
  ChannelID INT NOT NULL,
  Name VARCHAR(75) NOT NULL,
  CreationDate DATETIME NOT NULL,
  Logo VARCHAR(200) NULL,
  PRIMARY KEY (
    ChannelID
  )
);

CREATE TABLE IF NOT EXISTS Message (
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

CREATE TABLE IF NOT EXISTS Settings (
  SettingsID INT NOT NULL,
  ChannelID INT NOT NULL,
  Setting1 INT NOT NULL,
  PRIMARY KEY (
    SettingsID
  )
);

CREATE TABLE IF NOT EXISTS UserByChannel (
  ID INT NOT NULL,
  UserID INT NOT NULL,
  ChannelID INT NOT NULL,
  Power INT NOT NULL,
  Title VARCHAR(50) NULL,
  PRIMARY KEY (
    ID
  )
);


ALTER TABLE Preferences ADD CONSTRAINT fk_Preferences_UserID FOREIGN KEY IF NOT EXISTS (UserID)
REFERENCES User (UserID);

ALTER TABLE Confirmation ADD CONSTRAINT fk_Confirmation_UserID FOREIGN KEY IF NOT EXISTS (UserID)
REFERENCES User (UserID);

ALTER TABLE Message ADD CONSTRAINT fk_Message_UserID FOREIGN KEY IF NOT EXISTS (UserID)
REFERENCES User (UserID);

ALTER TABLE Message ADD CONSTRAINT fk_Message_ChannelID FOREIGN KEY IF NOT EXISTS (ChannelID)
REFERENCES Channel (ChannelID);

ALTER TABLE Settings ADD CONSTRAINT fk_Settings_ChannelID FOREIGN KEY IF NOT EXISTS (ChannelID)
REFERENCES Channel (ChannelID);

ALTER TABLE UserByChannel ADD CONSTRAINT fk_UserByChannel_UserID FOREIGN KEY IF NOT EXISTS (UserID)
REFERENCES User (UserID);

ALTER TABLE UserByChannel ADD CONSTRAINT fk_UserByChannel_ChannelID FOREIGN KEY IF NOT EXISTS (ChannelID)
REFERENCES Channel (ChannelID);

ALTER TABLE Friends ADD CONSTRAINT fk_Friends_UserA FOREIGN KEY IF NOT EXISTS (UserA)
REFERENCES User (UserID);

ALTER TABLE Friends ADD CONSTRAINT fk_Friends_UserB FOREIGN KEY IF NOT EXISTS (UserB)
REFERENCES User (UserID);

ALTER TABLE Notification ADD CONSTRAINT fk_Notif_User FOREIGN KEY IF NOT EXISTS (User)
REFERENCES User (UserID);

INSERT IGNORE INTO User (UserID, UserName, Mail, Connected, Password, Confirmed) VALUES (0,"Anonymous","chatmebaby2k18@gmail.com",1,"admin",1);
INSERT IGNORE INTO Channel (ChannelID, Name, CreationDate) VALUES (0,"General", NOW());
INSERT IGNORE INTO Channel (ChannelID, Name, CreationDate) VALUES (1,"Random", NOW());
INSERT IGNORE INTO UserByChannel (ID,UserID,ChannelID,Power) VALUES (0,0,0,100);
INSERT IGNORE INTO UserByChannel (ID,UserID,ChannelID,Power) VALUES (1,0,1,100);