
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Signup from "../Signup";
import authReducer from "../../features/authSlice"
import React from "react";
import LoginScreen from "../Login";
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Component UI Check Test", () => {
    const mockStore = configureStore({
      reducer: { createAccount: authReducer },
    });
  
    beforeEach(() => {
      render( <Provider store={mockStore}>
        <MemoryRouter>
          <Signup></Signup>
        </MemoryRouter>
      </Provider>)
     
    });
  
    test("Check Welcome Back in Login Component", () => {
      const render_main_heading = screen.getByText(/Create Your Account/i);
    expect(render_main_heading).toBeInTheDocument();
    })
    test("Check placeholder of Input fields",()=>{
      const seeLabel1=screen.getByPlaceholderText(/full name/i)
      const seeLabel2=screen.getByPlaceholderText(/^email address$/i)
      const seeLabel3=screen.getByPlaceholderText(/^password$/i)
      const seeLabel4=screen.getByPlaceholderText(/^confirm password$/i)
      expect(seeLabel1).toBeInTheDocument();
      expect(seeLabel2).toBeInTheDocument();
      expect(seeLabel3).toBeInTheDocument();
      expect(seeLabel4).toBeInTheDocument();
    })
 
     test("Check Button exist or not",()=>{
        const checkButton=screen.getByRole("button",{name:/^sign up$/i})
        expect(checkButton).toBeInTheDocument();
      })

    test("Check login button exists or not",()=>{
      const checkLoginButton=screen.getByRole("link",{name:/^log in?$/i})
      expect(checkLoginButton).toBeInTheDocument();
    })
  });

  describe("Check redirection",()=>{
    const mockStore = configureStore({
      reducer: { createAccount: authReducer },
    });
    beforeEach(() => {
      render( <Provider store={mockStore}>
        <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/login" element={<LoginScreen/>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
        </Routes>
        </MemoryRouter>
      </Provider>)
     
    });
    test("Check redirection of login page",()=>{
        const checkLoginButton=screen.getByRole("link",{name:/^log in?$/i})
        fireEvent.click(checkLoginButton)
    
    const render_main_heading = screen.getByText(/welcome back/i);
      expect(render_main_heading).toBeInTheDocument();
    })
  
  
  })
  


  describe("Check field correctly working or not ",()=>{
    const mockStore = configureStore({
      reducer: { createAccount: authReducer },
    });
    beforeEach(() => {
      render( <Provider store={mockStore}>
        <MemoryRouter>
          <Signup></Signup>
        </MemoryRouter>
      </Provider>)
     
    });
    test("Check Full Name field is working or not ",()=>{
      const targetEmailField=screen.getByPlaceholderText(/^full name$/i)
      fireEvent.change(targetEmailField,{target:{value:"Muhammad Abdullah"}})
  
      expect(targetEmailField.value).toBe("Muhammad Abdullah");
    })
  
    test("Check Email field is working or not ",()=>{
      const targetPasswordField=screen.getByPlaceholderText(/^email address$/i)
      fireEvent.change(targetPasswordField,{target:{value:"sheraz098@gmail.com"}})
  
      expect(targetPasswordField.value).toBe("sheraz098@gmail.com");
    })
  
    test("Check Password field is working or not ",()=>{
        const targetPasswordField=screen.getByPlaceholderText(/^password$/i)
        fireEvent.change(targetPasswordField,{target:{value:"asim098@"}})
    
        expect(targetPasswordField.value).toBe("asim098@");
      })

      test("Check Confirm Password field is working or not ",()=>{
        const targetConfirmPasswordField=screen.getByPlaceholderText(/^confirm password$/i)
        fireEvent.change(targetConfirmPasswordField,{target:{value:"asim098@"}})
    
        expect(targetConfirmPasswordField.value).toBe("asim098@");
      })
    
  })
  

  describe("Signup API Integration Test", () => {
    let store;
  
    beforeEach(() => {
      store = configureStore({
        reducer: { createAccount: authReducer },
      });
  
      global.fetch = jest.fn(); // mock fetch
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test("successful signup triggers API call and redirects", async () => {
  
      const mockUser = {
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
        json: async () => mockUser,
      });
  
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Signup />
          </MemoryRouter>
        </Provider>
      );
  
      // Fill the form
      fireEvent.change(screen.getByPlaceholderText(/^full name$/i), {
        target: { value: "sheraz@gmail.com" },
      });
      fireEvent.change(screen.getByPlaceholderText(/^email address$/i), {
        target: { value: "sheraz@gmail.com" },
      });
      fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
        target: { value: "123456" },
      });
      fireEvent.change(screen.getByPlaceholderText(/^confirm password$/i), {
        target: { value: "123456" },
      });
  
      // Submit form
      fireEvent.click(screen.getByRole("button",{name:/^sign up$/i}));
  
      // Wait for navigation to happen
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5000/user/create-account",
          expect.objectContaining({
            method: "POST",
            // credentials: "include",
            headers: { "Content-Type": "application/json" },
          })
        );
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
    });
  
  //   test("failed login shows error message", async () => {
  //     const mockError = { message: "Invalid credentials" };
  //     global.fetch.mockResolvedValueOnce({
  //       ok: false,
  //       json: async () => mockError,
  //     });
  
  //     render(
  //       <Provider store={store}>
  //         <MemoryRouter>
  //           <LoginScreen />
  //         </MemoryRouter>
  //       </Provider>
  //     );
     
  //     fireEvent.change(screen.getByPlaceholderText(/^full name$/i), {
  //       target: { value: "Bilal Chohan" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText(/^email address$/i), {
  //       target: { value: "bilal@email.com" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
  //       target: { value: "wrong_password123@" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
  //       target: { value: "wrong_password123@" },
  //     });
  //     fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));
  
  //     await waitFor(() => {
  //       expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  //     });
  //   });
  });
  
  
  