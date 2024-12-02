import axios from "axios";
import { serverApi } from "../../lib/config";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
  UpdateEmail,
  UpdatePassword,
} from "../../lib/types/member";

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getTopUsers(): Promise<Member[]> {
    try {
      const url = this.path + "/member/top-users";
      const result = await axios.get(url);

      return result.data;
    } catch (err) {
      console.log("Error getTopUsers", err);
      throw err;
    }
  }

  public async getRestaurnat(): Promise<Member> {
    try {
      const url = this.path + "/member/admin";
      const result = await axios.get(url);

      const restaurant: Member = result.data;
      return restaurant;
    } catch (err) {
      console.log("Error, getRestaurant", err);
      throw err;
    }
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = this.path + "/member/signup";
      const result = await axios.post(url, input, { withCredentials: true });
      const member: Member = result.data.member;

      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("Error signup", err);
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = this.path + "/member/login";
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("login:", result);

      const member: Member = result.data.member;
      console.log("member", member);
      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      console.log("Error, login", err);
      throw err;
    }
  }

  public async deleteAccount(input: LoginInput): Promise<void> {
    try {
      const url = `${this.path}/member/delete`;
      await axios.post(url, input, { withCredentials: true });

      localStorage.removeItem("memberData");
    } catch (err) {
      console.log("Error, deleteAccount", err);
      throw err;
    }
  }

  public async deleteImage(): Promise<Member> {
    try {
      const url = this.path + "/member/delete/image";
      const member = await axios.get(url, {
        withCredentials: true,
      });

      localStorage.setItem("memberData", JSON.stringify(member.data));
      return member.data;
    } catch (err) {
      console.log("Error, deleteImage", err);
      throw err;
    }
  }

  public async logout(): Promise<void> {
    try {
      const url = this.path + "/member/logout";
      await axios.post(url, {}, { withCredentials: true });
      localStorage.removeItem("memberData");
    } catch (err) {
      console.log("Error logout", err);
      throw err;
    }
  }

  public async updatePassowrd(input: UpdatePassword): Promise<Member> {
    try {
      const url = this.path + "/member/update/password";
      const result = await axios.post(url, input, { withCredentials: true });
      localStorage.setItem("memberData", JSON.stringify(result.data));
      return result.data;
    } catch (err) {
      console.log("Error, updatePassword");
      throw err;
    }
  }

  public async updateEmail(input: UpdateEmail): Promise<Member> {
    try {
      const url = this.path + "/member/update/email";
      const result = await axios.post(url, input, { withCredentials: true });
      localStorage.setItem("memberData", JSON.stringify(result.data));
      console.log(result.data);
      return result.data;
    } catch (err) {
      console.log("Error, updateEmail");
      throw err;
    }
  }

  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    try {
      const url = `${this.path}/member/update`;
      const formData = new FormData();
      formData.append("memberNick", input.memberNick || "");
      formData.append("memberPhone", input.memberPhone || "");
      formData.append("memberAddress", input.memberAddress || "");
      formData.append("memberDesc", input.memberDesc || "");
      formData.append("memberImage", input.memberImage || "");

      const result = await axios(url, {
        method: "POST",
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("updateMember:", result);
      const member: Member = result.data;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("Error, updateMember", err);
      throw err;
    }
  }
}

export default MemberService;
