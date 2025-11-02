import { fireEvent, render,screen, waitFor } from "@testing-library/react";
import ForgotPassword from "../ForgotPassword";
import authReducer from "../../features/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import LoginScreen from "../Login";
import { Routes,Route } from "react-router-dom";
import { store } from "../../redux/store";
import EmailSent from '../EmailSent'
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UI Ckeck test",()=>{
    const mockStore = configureStore({
        reducer: { createAccount: authReducer },
      });

      beforeEach(()=>{
        render(
            <Provider store={mockStore}>
            <MemoryRouter>
              <ForgotPassword></ForgotPassword>
            </MemoryRouter>
          </Provider>
        )
    })
    test("Test the main title",()=>{
        
       const renderMainText=screen.getByText(/forgot password?/i) 
       expect(renderMainText).toBeInTheDocument();
    })
    test("Test the text",()=>{
        
        const renderMainText=screen.getByText(/No worries, we'll send you reset notification./i) 
        expect(renderMainText).toBeInTheDocument();
     })
     test("Check label of UI",()=>{
        const targetLabelEmail=screen.getByLabelText(/email address/i)
        expect(targetLabelEmail).toBeInTheDocument();
     })
     test("Check placeholder of UI",()=>{
        const targetPlaceholderEmail=screen.getByPlaceholderText(/enter your email/i)
        expect(targetPlaceholderEmail).toBeInTheDocument();
     })
     test("Test button exists or not",()=>{
        const targetButton=screen.getByRole("button",{name:/reset password/i})
        expect(targetButton).toBeInTheDocument();
     })
     test("Test link exists or not",()=>{
        const targetLink=screen.getByRole("link",{name:/^login a account$/i})
        expect(targetLink).toBeInTheDocument();
     })
     
})

describe("Check field correctly working or not",()=>{
    const mockStore = configureStore({
        reducer: { createAccount: authReducer },
      });
    beforeEach(()=>{
        render(
            <Provider store={mockStore}>
            <MemoryRouter>
              <ForgotPassword></ForgotPassword>
            </MemoryRouter>
          </Provider>
        )

    })
    test("Check email field correctly work or not",()=>{
        const targetEmail=screen.getByPlaceholderText(/enter your email/i)
        fireEvent.change(targetEmail,{target:{value:"abdullah098@gmail.com"}})
        expect(targetEmail.value).toBe("abdullah098@gmail.com")
    })
})

describe("Check redirection",()=>{
    const mockStore = configureStore({
        reducer: { createAccount: authReducer },
      });
    beforeEach(()=>{
        render(
            <Provider store={mockStore}>
            <MemoryRouter initialEntries={['/forgot-password']}>
                <Routes>
                    <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
                    <Route path="/login" element={<LoginScreen></LoginScreen>}></Route>
                </Routes>
              
            </MemoryRouter>
          </Provider>
        )

    })
    test("Check redirection of login correct work or not",()=>{
        const targetLink=screen.getByRole("link",{name:/^login a account$/i})
        fireEvent.click(targetLink)
        const checkLoginPage=screen.getByText(/^welcome back$/i)
        expect(checkLoginPage).toBeInTheDocument();
    }) 
})

describe("Test forgot password API call",()=>{


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

    test("Test forgot password API successful when state fullfilled",async()=>{
        const fakeResponse={
            "success": true,
            "message": "Reset password email sent successfully"
        }
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => fakeResponse,
          });
           render(
                <Provider store={store}>
                  <MemoryRouter initialEntries={["/forgot-password"]}>
                  <Routes>
                    <Route path="/forgot-password" element={             <ForgotPassword />}></Route>
                    <Route path="/email-sent" element={<EmailSent></EmailSent>}></Route>
                  </Routes>
                  </MemoryRouter>
                </Provider>
              );
          
            const targetEmailField=screen.getByPlaceholderText(/enter your email/i)
            fireEvent.change(targetEmailField,{target:{value:"ali@test.com"}})
            const targetButton=screen.getByRole("button",{name:/^reset password$/i})
            fireEvent.click(targetButton)

            await waitFor(()=>{
                expect(global.fetch).toHaveBeenCalledTimes(1)
                expect(global.fetch).toHaveBeenCalledWith("http://localhost:5000/user/forget-password",expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                  }))
            })
            expect(mockNavigate).toHaveBeenCalledWith("/email-sent");
        })


})