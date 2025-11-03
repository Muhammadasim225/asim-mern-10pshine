import ResetPassword from "../../components/ResetPassword";
import { forgetPassword, loginAccount, resetPassword } from "../authSlice";
import { createAccount } from "../authSlice";
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("loginAccount async thunk", () => {
  test("dispatches fulfilled when login is successful", async () => {
    const fakeResponse = {
      user: { id: 1, name: "Ali", email: "ali@test.com" },
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = loginAccount({ email: "ali@test.com", password: "123456" });
    const result = await thunk(dispatch, getState, undefined);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/user/login-account",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "ali@test.com", password: "123456" }),
      })
    );

    expect(result.type).toBe("loginAccount/fulfilled");
    expect(result.payload).toEqual(fakeResponse);
  });

  test("dispatches rejected when login fails (401)", async () => {
    const errorResponse = { message: "Invalid credentials" };

    // Mock failed response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => errorResponse,
    });

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = loginAccount({ email: "wrong@test.com", password: "badpass" });
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe("loginAccount/rejected");
    expect(result.payload).toEqual(errorResponse);
  });

  test("dispatches rejected on network error", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = loginAccount({ email: "ali@test.com"});
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe("loginAccount/rejected");
    expect(result.payload).toEqual({
      message: "Network error: Please check your connection",
    });
  });
});


describe("Forget Password async thunk",()=>{
    test("dispatches fulfilled when forgot password execute",async()=>{
        const fakeResponse={
                "success": true,
                "message": "Reset password email sent successfully" 
        }

        global.fetch.mockResolvedValueOnce({
            ok:true,
            json:async()=>fakeResponse
        })

        const dispatch = jest.fn();
        const getState = jest.fn();

        const thunk = forgetPassword({ email: "ali@test.com"});
        const result=await thunk(dispatch, getState, undefined);

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:5000/user/forget-password",
            expect.objectContaining({
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: "ali@test.com"}),
            })
          );
          expect(result.type).toBe("forgetPassword/fulfilled");
          expect(result.payload).toEqual(fakeResponse);
    })
    // test("dispatches reject when forgot password rejected (401 Unauthorized)",()=>{
        
    // })
    // test("dispatches rejected when forgot password show network error",()=>{
        
    // })
})

describe("Reset Password async thunk",()=>{
  test("dispatches fulfilled when reset password executes",async()=>{

    const fakeResponse={
      "message": "Password has been reset",
      "data": {
          "id": "a92a549c-969b-4de1-91bf-6ac5a32f1466",
          "full_name": "Touseer Amir",
          "email_address": "touseeramir1920@gmail.com",
          "password": "$2b$10$0Rflq7X6YfFa1tFGeocV4.rmhKHyX5Lkkf3XBbQ4hjwTqtOwdx.Dy",
          "googleId": null,
          "facebookId": null,
          "avatar": "/uploads/profilePics/1761213106711-1760627825374-ppf_-_Copy.jpg",
          "resetToken": "",
          "resetTokenExpiry": null,
          "createdAt": "2025-10-09T14:20:54.000Z",
          "updatedAt": "2025-10-31T17:30:23.000Z"
      }
  }

  global.fetch.mockResolvedValueOnce({
    ok:true,
    json:async()=>fakeResponse
})

const dispatch = jest.fn();
const getState = jest.fn();

const thunk = resetPassword({ password:"asim098@",  token:
  "468a868b0d6896cc82b8f220d9290b3722efecf915b0b58d3a0f8f8246c31507",});
const result=await thunk(dispatch, getState, undefined);

expect(fetch).toHaveBeenCalledWith(
  "http://localhost:5000/user/reset-password?token=468a868b0d6896cc82b8f220d9290b3722efecf915b0b58d3a0f8f8246c31507",
  expect.objectContaining({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "asim098@"}),
  })
);
expect(result.type).toBe("auth/resetPassword/fulfilled");
expect(result.payload).toEqual(fakeResponse);

  })
})



describe("Signup account  async thunk",()=>{
  test("dispatches fulfilled when  create account executes",async()=>{

    const fakeResponse={
      "success": true,
      "message": "Account registered successfully",
      "user": {
          "id": "fbfbd0c5-3393-437c-a6b9-7628d250d032",
          "full_name": "Bilal Chohan",
          "email_address": "bilalchohna123@gmail.com"
      }
  }

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => fakeResponse,
  });

  const dispatch = jest.fn();
  const getState = jest.fn();

  const data = {
    full_name: "Bilal Chohan",
    email_address: "bilalchohna123@gmail.com",
    password: "asim098",
  };

  const thunk = createAccount(data);
  const result = await thunk(dispatch, getState, undefined);

  // Check fetch called with correct arguments
  expect(fetch).toHaveBeenCalledWith(
    "http://localhost:5000/user/create-account",
    expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );

  // Check thunk result
  expect(result.type).toBe("createAccount/fulfilled");
  expect(result.payload).toEqual(fakeResponse);

  })
})
