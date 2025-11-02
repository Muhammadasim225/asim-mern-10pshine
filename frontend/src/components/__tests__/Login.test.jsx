import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import LoginScreen from "../Login";
import Signup from '../Signup'
import authReducer  from "../../features/authSlice";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "../ForgotPassword"
import { Routes,Route } from "react-router-dom";
import { waitFor } from "@testing-library/react";

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
        <LoginScreen></LoginScreen>
      </MemoryRouter>
    </Provider>)
   
  });

  test("Check Welcome Back in Login Component", () => {
    const render_main_heading = screen.getByText(/welcome back/i);
  expect(render_main_heading).toBeInTheDocument();
  })
  test("Check label of Input fields",()=>{
    const seeLabel1=screen.getByLabelText(/email address/i)
    const seeLabel2=screen.getByLabelText(/^password$/i)
    expect(seeLabel1).toBeInTheDocument();
    expect(seeLabel2).toBeInTheDocument();
  })

  test("CHeck placeholder text of login form",()=>{
    const checkPlaceholder1=screen.getByPlaceholderText(/enter your email/i)
    const checkPlaceholder2=screen.getByPlaceholderText(/enter your password/i)
    expect(checkPlaceholder1).toBeInTheDocument()
    expect(checkPlaceholder2).toBeInTheDocument()
  })

  test("Check Button exist or not",()=>{
    const checkButton=screen.getByRole("button",{name:/^sign in$/i})
    expect(checkButton).toBeInTheDocument();
  })
  test("Check forgot Button exists or not",()=>{
    const checkForgotButton=screen.getByRole("link",{name:/^forgot password?$/i})
    expect(checkForgotButton).toBeInTheDocument();
  })
});

describe("Check redirection",()=>{
  const mockStore = configureStore({
    reducer: { createAccount: authReducer },
  });
  beforeEach(() => {
    render( <Provider store={mockStore}>
      <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<LoginScreen/>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
      </Routes>
      </MemoryRouter>
    </Provider>)
   
  });
  test("Check redirection of forgot page",()=>{
    const targetForgotLink=screen.getByRole("link",{name:/^forgot password?$/i})
    fireEvent.click(targetForgotLink)
  
    const checkForgotPage=screen.getByText(/^no worries, we'll send you reset notification.$/i)
    expect(checkForgotPage).toBeInTheDocument();
  })

  test("Check redirection of Signup page",()=>{
    const targetSignupLink=screen.getByRole("link",{name:/^sign up for an account?$/i})
    fireEvent.click(targetSignupLink)
    const checkSignupPage=screen.getByText(/^create your account$/i)
    expect(checkSignupPage).toBeInTheDocument();
  })


})

describe("Check field correctly working or not ",()=>{
  const mockStore = configureStore({
    reducer: { createAccount: authReducer },
  });
  beforeEach(() => {
    render( <Provider store={mockStore}>
      <MemoryRouter>
        <LoginScreen></LoginScreen>
      </MemoryRouter>
    </Provider>)
   
  });
  test("Check Email Address field is working or not ",()=>{
    const targetEmailField=screen.getByPlaceholderText(/enter your email/i)
    fireEvent.change(targetEmailField,{target:{value:"sheraz@gmail.com"}})

    expect(targetEmailField.value).toBe("sheraz@gmail.com");
  })

  test("Check Password field is working or not ",()=>{
    const targetPasswordField=screen.getByPlaceholderText(/enter your password/i)
    fireEvent.change(targetPasswordField,{target:{value:"sheraz@098"}})

    expect(targetPasswordField.value).toBe("sheraz@098");
  })

})


describe("Login API Integration Test", () => {
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

  test("successful login triggers API call and redirects", async () => {

    const mockUser = { user: { id: 1, name: "Sheraz" } };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginScreen />
        </MemoryRouter>
      </Provider>
    );

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "sheraz@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "123456" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    // Wait for navigation to happen
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/user/login-account",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  test("failed login shows error message", async () => {
    const mockError = { message: "Invalid credentials" };
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockError,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginScreen />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "wrong@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});

