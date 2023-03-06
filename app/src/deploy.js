import {ethers} from 'ethers';
import EscrowFactory from './artifacts/contracts/EscrowFactory.sol/EscrowFactory';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

export async function deploy(signer, arbiter, beneficiary, value) {
    return getFactory(signer).create(arbiter, beneficiary, {value});
}

export async function getEscrows(signer) {
    return getFactory(signer).getInstances();
}

export function getEscrowAt(address, signer) {
    return new ethers.Contract(
        address,
        Escrow.abi,
        signer
    );
}

export function getFactory(signer) {
    const factoryAddress = process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS;
    if (!factoryAddress) {
        throw new Error('Factory contract not deployed!');
    }
    return new ethers.Contract(
        factoryAddress,
        EscrowFactory.abi,
        signer
    );
}
