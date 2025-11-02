import { screen,render, fireEvent } from "@testing-library/react"
import ResetPassword from "../ResetPassword"
import { MemoryRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import authReducer from '../../features/authSlice'
import React from "react"
import { Routes,Route } from "react-router-dom"
import LoginScreen from "../Login"
import { waitFor } from "@testing-library/react"
import { act } from "@testing-library/react"
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UI Check test",()=>{
    const mockStore = configureStore({
        reducer: { createAccount: authReducer },
      });
    
    beforeEach(()=>{
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <ResetPassword></ResetPassword>
                </MemoryRouter>
            </Provider>
        )
    })
    test("Test Main Heading exists or not",()=>{
        const targetMainText=screen.getByText(/set new password/i)
        expect(targetMainText).toBeInTheDocument();
    })

    test("Test text in UI exsits or not ",()=>{
        const target_text=screen.getByText(/^your new password must be different from from previous used passwords.$/i)
        expect(target_text).toBeInTheDocument();
    })
    test("Check labels exist or not",()=>{
        const label1=screen.getByLabelText(/^password$/i)
        const label2=screen.getByLabelText(/^confirm password$/i)
        expect(label1).toBeInTheDocument();
        expect(label2).toBeInTheDocument();
    })
    test("Check placeholder exist or not",()=>{
        const placeholderPassword=screen.getByPlaceholderText(/enter your password/i)
        const placeholderConfirmPassword=screen.getByPlaceholderText(/enter your confirm password/i)
        expect(placeholderPassword).toBeInTheDocument();
        expect(placeholderConfirmPassword).toBeInTheDocument();
    })
    test("Button exists or not",()=>{
        const targetButton=screen.getByRole("button",{name:/^sign in$/i})
        expect(targetButton).toBeInTheDocument();
    })
    test("Check link correctly work or not",()=>{
        const targetLink=screen.getByRole("link",{name:/go back to login/i})
        expect(targetLink).toBeInTheDocument();
    })
})

describe("Check fields correctly works or not",()=>{
    const mockStore = configureStore({
        reducer: { createAccount: authReducer },
      });
    beforeEach(()=>{
        render(
            <Provider store={mockStore}>
            <MemoryRouter>
              <ResetPassword></ResetPassword>
            </MemoryRouter>
          </Provider>
        )

    })
    test("Check password or confirm password field correctly works or not",()=>{
        const targetField1=screen.getByPlaceholderText(/enter your password/i)
        const targetField2=screen.getByPlaceholderText(/enter your confirm password/i)
        fireEvent.change(targetField1,{target:{value:"abdullah123@"}})
        fireEvent.change(targetField2,{target:{value:"abdullah123@"}})
        expect(targetField1.value).toBe("abdullah123@")
        expect(targetField2.value).toBe("abdullah123@")

    })
  })

describe("Check redirection",()=>{
    const mockStore = configureStore({
        reducer: { createAccount: authReducer },
      });
    beforeEach(()=>{
        render(
            <Provider store={mockStore}>
            <MemoryRouter initialEntries={["/reset-password"]}>
                <Routes>
                    <Route path="/reset-password" element={<ResetPassword></ResetPassword>}></Route>
                    <Route path="/login" element={<LoginScreen></LoginScreen>}></Route>
                </Routes>
            </MemoryRouter>
          </Provider>
        )

    })

    test("Check link correctly works or not", ()=>{
        const targetLink=screen.getByRole("link",{name:/go back to login/i})
        fireEvent.click(targetLink)
        const checkLoginPage=screen.getByText(/^welcome back$/i)
        expect(checkLoginPage).toBeInTheDocument();
    })
  })

  describe("Test Reset Password API correcly works or not ",()=>{
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: { createAccount: authReducer },
      });
  
      global.fetch = jest.fn(); 
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });

    
    test("Check async thunk fulfilled when executes successfully", async () => {
      jest.useFakeTimers(); // ⬅️ control setTimeout
    
      const mockResponse = {
        message: "Password has been reset",
        data: {
          id: "a92a549c-969b-4de1-91bf-6ac5a32f1466",
          full_name: "Touseer Amir",
          email_address: "touseeramir1920@gmail.com",
          password: "$2b$10$0Rflq7X6YfFa1tFGeocV4.rmhKHyX5Lkkf3XBbQ4hjwTqtOwdx.Dy",
          createdAt: "2025-10-09T14:20:54.000Z",
          updatedAt: "2025-10-31T17:30:23.000Z",
        },
      };
    
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
    
      render(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              "/reset-password?token=468a868b0d6896cc82b8f220d9290b3722efecf915b0b58d3a0f8f8246c31507",
            ]}
          >
            <Routes>
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/login" element={<LoginScreen />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    
      const targetField1 = screen.getByPlaceholderText(/enter your password/i);
      const targetField2 = screen.getByPlaceholderText(/enter your confirm password/i);
      const submitButton = screen.getByRole("button", { name: /^sign in$/i });
    
  fireEvent.change(targetField1, { target: { value: "asim098@" } });
  fireEvent.change(targetField2, { target: { value: "asim098@" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // ⚡️ Advance timers inside act() so React can process setTimeout
  await act(async () => {
    jest.runAllTimers();
  });

  // ✅ Now navigate should have been called
  expect(mockNavigate).toHaveBeenCalledWith("/login");

  jest.useRealTimers();
});
  })