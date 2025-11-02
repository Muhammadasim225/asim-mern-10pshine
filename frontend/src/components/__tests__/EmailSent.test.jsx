import { screen,render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import EmailSent from "../EmailSent";
import authReducer from "../../features/authSlice";
import React from "react";
import ForgotPassword from "../ForgotPassword";
import { Route,Routes } from "react-router-dom";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginScreen from "../Login";
import Dashboard from "../Dashboard";
describe("Check UI test",()=>{
    const mockStore = configureStore({
        reducer: { createAccount: authReducer },
      });

      beforeEach(()=>{
        render(
            <Provider store={mockStore}>
            <MemoryRouter>
              <EmailSent></EmailSent>
            </MemoryRouter>
          </Provider>
        )
    })
        test("Test the main title",()=>{
            
           const renderMainText=screen.getByText(/check your mail?/i) 
           expect(renderMainText).toBeInTheDocument();
        })
         test("Test the text",()=>{
                
                const renderMainText=screen.getByText(/we have sent a password recover instructions to your email./i) 
                expect(renderMainText).toBeInTheDocument();
             })
               test("Test button exists or not",()=>{
                     const targetButton=screen.getByRole("link",{name:/open email app/i})
                     expect(targetButton).toBeInTheDocument();
                     const targetButton2=screen.getByRole("link",{name:/skip, i'll confirm later/i})
                     expect(targetButton2).toBeInTheDocument();
                  })
            

    
    
    
})

describe("Check redirection",()=>{
    const mockStore = configureStore({
        reducer: { createAccount: authReducer },
      });
    beforeEach(()=>{
        render(
            <Provider store={mockStore}>
            <MemoryRouter initialEntries={['/email-sent']}>
                <Routes>
                    <Route path="/email-sent" element={<EmailSent></EmailSent>}></Route>
                    <Route path="/" element={<Dashboard></Dashboard>}></Route>
                    <Route path="/login" element={<LoginScreen></LoginScreen>}></Route>
                    <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
                </Routes>
              
            </MemoryRouter>
          </Provider>
        )

    })

       test("Check redirection of email sent to forogt page correct work or not",()=>{
            const targetLink=screen.getByRole("link",{name:/^try another email address$/i})
            fireEvent.click(targetLink)
            const renderMainText=screen.getByText(/forgot password?/i) 
            expect(renderMainText).toBeInTheDocument();
        }) 

        test("Check redirection open gmail app correct works or not", async()=>{
            const targetButton=screen.getByRole("link",{name:/open email app/i})
            expect(targetButton).toBeInTheDocument();
            expect(targetButton).toHaveAttribute("href", "https://gmail.com");
            await userEvent.click(targetButton);

        })


})