import {ethers} from 'ethers';
import {useEffect, useState} from 'react';
import {deploy, getEscrows, getEscrowAt} from './deploy';
import Escrow from './Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
    const approveTxn = await escrowContract.connect(signer).approve();
    await approveTxn.wait();
}

function App() {
    const [escrows, setEscrows] = useState([]);
    const [account, setAccount] = useState();
    const [signer, setSigner] = useState();

    useEffect(() => {
        async function run() {
            const accounts = await provider.send('eth_requestAccounts', []);
            const signer_ = provider.getSigner();
            const escrowAddresses = await getEscrows(signer_);
            const instances = await Promise.all(escrowAddresses.map((addr) => buildEscrowObject(addr,  signer_)));

            setAccount(accounts[0]);
            setSigner(signer_);
            setEscrows(instances);
        }

        run();
    }, [account]);

    async function buildEscrowObject(address, signer) {
        const escrowContract = getEscrowAt(address, signer);
        return {
            address,
            arbiter: await escrowContract.arbiter(),
            beneficiary: await escrowContract.beneficiary(),
            value: (await provider.getBalance(address)).toString(),
            handleApprove: async () => {
                escrowContract.on('Approved', () => {
                    document.getElementById(address).className =
                        'complete';
                    document.getElementById(address).innerText =
                        "✓ It's been approved!";
                });

                await approve(escrowContract, signer);
            }
        };
    }

    async function newContract() {
        const beneficiary = document.getElementById('beneficiary').value;
        const arbiter = document.getElementById('arbiter').value;
        const value = ethers.utils.parseEther(document.getElementById('eth').value);
        const escrowContract = await deploy(signer, arbiter, beneficiary, value);
        const contract = await buildEscrowObject(escrowContract.address, signer);
        setEscrows([...escrows, contract]);
    }

    return (
        <>
            <div className="contract">
                <h1> New Contract </h1>
                <label>
                    Arbiter Address
                    <input type="text" id="arbiter"/>
                </label>

                <label>
                    Beneficiary Address
                    <input type="text" id="beneficiary"/>
                </label>

                <label>
                    Deposit Amount (in ETH)
                    <input type="text" id="eth"/>
                </label>

                <div
                    className="button"
                    id="deploy"
                    onClick={(e) => {
                        e.preventDefault();

                        newContract();
                    }}
                >
                    Deploy
                </div>
            </div>

            <div className="existing-contracts">
                <h1> Existing Contracts </h1>

                <div id="container">
                    {escrows.map((escrow) => {
                        return <Escrow key={escrow.address} {...escrow} />;
                    })}
                </div>
            </div>
        </>
    );
}

export default App;
