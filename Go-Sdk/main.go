package main

import (
	
	"fmt"
	"log"

	"github.com/stellar/go/clients/horizonclient"
	"github.com/stellar/go/keypair"
	"github.com/stellar/go/network"
	"github.com/stellar/go/txnbuild"
)

func main() {
	
	sourceSecret := "SBACJ6NGHW6NQZ47KE7IFF4Z5VWT4SDS3MXTDID6VV5Q2YQ2DPPXNTWU"
	destAddress := "GBSLGC3LP2GILULAK5S27CTGM3D6VVIILQZPUMNGBKLP2K3JXMV25QWT"

	
	sourceKP, err := keypair.ParseFull(sourceSecret)
	if err != nil {
		log.Fatalf("Invalid secret key: %v", err)
	}
	sourceAddress := sourceKP.Address()

	
	client := horizonclient.DefaultTestNetClient

	
	ar := horizonclient.AccountRequest{AccountID: sourceAddress}
	sourceAccount, err := client.AccountDetail(ar)
	if err != nil {
		log.Fatalf("Failed to load account: %v", err)
	}

	// Create a payment operation (1 XLM)
	paymentOp := txnbuild.Payment{
		Destination: destAddress,
		Amount:      "1",
		Asset:       txnbuild.NativeAsset{},
	}

	
	timeout := txnbuild.NewTimeout(300)

	
	txParams := txnbuild.TransactionParams{
		SourceAccount:        &sourceAccount,
		IncrementSequenceNum: true,
		BaseFee:              txnbuild.MinBaseFee,
		Operations:           []txnbuild.Operation{&paymentOp},
		Preconditions:        txnbuild.Preconditions{TimeBounds: timeout},
	}

	tx, err := txnbuild.NewTransaction(txParams)
	if err != nil {
		log.Fatalf("Transaction build error: %v", err)
	}

	
	signedTx, err := tx.Sign(network.TestNetworkPassphrase, sourceKP)
	if err != nil {
		log.Fatalf("Signing failed: %v", err)
	}

	// Submit transaction
	resp, err := client.SubmitTransaction(signedTx)
	if err != nil {
		log.Fatalf("Transaction failed: %v", err)
	}

	fmt.Println("✅ Transaction successful!")
	fmt.Println("🔗 Hash:", resp.Hash)
}