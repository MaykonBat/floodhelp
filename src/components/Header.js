"use client"

import { useState, useEffect } from "react";
import { doLogin } from "@/services/Web3Service";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";

export default function Header() {

  const [wallet, setWallet] = useState("");

  useEffect(() => {
    setWallet(localStorage.getItem("wallet") || "");
  }, [])

  function btnLoginClick() {
    doLogin()
      .then(wallet => setWallet(wallet))
      .catch(err => {
        console.error(err);
        alert(err.message);
      })
  }

  function btnLogoutClick(){
        localStorage.removeItem("wallet");
        window.location.reload();
    }

  return (
    <header className="p-3 text-bg">
      <div className="container">
        <div className="d-flex flex-wrap align=items-center justify-content-center">
          <a href="/" className="justify-content-start" style={{ textDecoration: "none" }}>
            <h1 className="fw-bold text-light">FloodHelp</h1>
          </a>
          <div className="text-end col-9">
            {
              wallet
                ? (
                  <>
                    <button type="button" className="btn btn-outline-light me-2" onClick={btnLogoutClick}>
                      <img src={generateAvatarURL(wallet)} width={20} height={20} className="rounded-circle me-2" />
                      {"0x..." + wallet.substring(37)}
                    </button>
                    <a href="/create" className="btn btn-warning">Pedir Ajuda</a>
                  </>
                )
                : <button type="button" className="btn btn-outline-light me-2" onClick={btnLoginClick}>
                  <img src="/metamask.png" width="24" className="me-3" />
                  Entrar
                </button>
            }
          </div>
        </div>
      </div>
    </header>
  )
}