import { OtpDtm } from "./otp.dtm";
import { UserDtm } from "./user.dtm";

export type UserOrCodeDtm = 
  | { user: UserDtm; code?: undefined }
  | { code: OtpDtm; user?: undefined };

function fromUser(user: UserDtm): UserOrCodeDtm {
  return { user };
}

function fromCode(code: OtpDtm): UserOrCodeDtm {
  return { code };
}

export const UserOrCodeDtm = {
  fromUser,
  fromCode,
};
