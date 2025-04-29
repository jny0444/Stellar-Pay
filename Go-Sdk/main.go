package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/stellar/go/clients/horizonclient"
	"github.com/stellar/go/keypair"
	"github.com/stellar/go/network"
	"github.com/stellar/go/txnbuild"
)

const sourceSecret = "SBACJ6NGHW6NQZ47KE7IFF4Z5VWT4SDS3MXTDID6VV5Q2YQ2DPPXNTWU"

type TransferRequest struct {
	Recipient string `json:"recipient"`
	Amount    string `json:"amount"`
}

func sendLumens(w http.ResponseWriter, r *http.Request) {
	// Decode the request body
	var req TransferRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Recipient == "" || req.Amount == "" {
		http.Error(w, "Missing recipient or amount", http.StatusBadRequest)
		return
	}

	sourceKP, err := keypair.ParseFull(sourceSecret)
	if err != nil {
		http.Error(w, "Invalid source key", http.StatusInternalServerError)
		return
	}
	sourceAddress := sourceKP.Address()
	client := horizonclient.DefaultTestNetClient

	// Load account
	ar := horizonclient.AccountRequest{AccountID: sourceAddress}
	sourceAccount, err := client.AccountDetail(ar)
	if err != nil {
		http.Error(w, "Cannot load source account", http.StatusInternalServerError)
		return
	}

	// Create payment operation
	paymentOp := txnbuild.Payment{
		Destination: req.Recipient,
		Amount:      req.Amount,
		Asset:       txnbuild.NativeAsset{},
	}

	// Create timeout
	timeout := txnbuild.NewTimeout(300)

	// Build transaction
	txParams := txnbuild.TransactionParams{
		SourceAccount:        &sourceAccount,
		IncrementSequenceNum: true,
		BaseFee:              txnbuild.MinBaseFee,
		Operations:           []txnbuild.Operation{&paymentOp},
		Preconditions:        txnbuild.Preconditions{TimeBounds: timeout},
	}
	tx, err := txnbuild.NewTransaction(txParams)
	if err != nil {
		http.Error(w, "Transaction build failed", http.StatusInternalServerError)
		return
	}

	// Sign transaction
	signedTx, err := tx.Sign(network.TestNetworkPassphrase, sourceKP)
	if err != nil {
		http.Error(w, "Signing failed", http.StatusInternalServerError)
		return
	}

	// Submit transaction
	resp, err := client.SubmitTransaction(signedTx)
	if err != nil {
		http.Error(w, fmt.Sprintf("Transaction failed: %v", err), http.StatusInternalServerError)
		return
	}

	// Return the response with the transaction hash
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Transaction successful",
		"hash":    resp.Hash,
	})
}

func main() {
	http.HandleFunc("/api/send", sendLumens)
	fmt.Println("🚀 API running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
