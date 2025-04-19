import forge from 'node-forge';
import CryptoJS from 'crypto-js';


export const generateRandomAESKey = () => {
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64);
};

export const getAESKeyFromPassword = (password, saltHex) => {
    if (typeof password !== 'string') {
        throw new Error("Password must be a string. Got: " + typeof password);
    }
    if (typeof saltHex !== 'string' || !/^[0-9a-fA-F]+$/.test(saltHex)) {
        throw new Error("Salt must be a hex string. Got: " + saltHex);
    }

    return CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(saltHex), {
        keySize: 256 / 32,
        iterations: 1000,
    });
};

export const encryptPrivateKey = (privateKey, password) => {
    try {
        // console.lo
        const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        // console.log(salt);
        const key = getAESKeyFromPassword(password, salt).toString();
        // console.log(key);
        // console.log("password at encryption ",password);
        // console.log("pkey at encryption ",privateKey);
        const encrypted = CryptoJS.AES.encrypt(privateKey, key);
        // console.log(encrypted);
        return { encryptedPrivateKey: encrypted.toString(), salt: salt };
    } catch (error) {
        console.log(error.message);
    }
};

export const decryptPrivateKey = (encrypted, password, salt) => {
    // console.log("password at decryption ",password);
    // console.log("pkey at decryption ",encrypted);
    const key = getAESKeyFromPassword(password, salt).toString();
    //   console.log(key);
    const decrypted = CryptoJS.AES.decrypt(encrypted, key);
    // console.log("decrypted ", decrypted.toString(CryptoJS.enc.Utf8));
    return decrypted.toString(CryptoJS.enc.Utf8);
};

export const encryptWithAES = (message, aesKey) => {
    if (!aesKey) throw new Error("AES key is null or undefined");
    // console.log(typeof aesKey);
    // const key = typeof aesKey === 'string' ? CryptoJS.enc.Hex.parse(aesKey) : aesKey;
    const encrypted = CryptoJS.AES.encrypt(message, aesKey);
    return encrypted.toString();
};

export const decryptWithAES = (cipher, aesKey) => {
    if (!aesKey) throw new Error("AES key is null or undefined");
    // console.log(typeof aesKey);

    // console.log("Decrypted with this ", aesKey);
    // console.log(cipher);
    // console.log(aesKey);
    // const key = typeof aesKey === 'string' ? CryptoJS.enc.Base64.parse(aesKey) : aesKey;
    const decrypted = CryptoJS.AES.decrypt(cipher, aesKey);
    // console.log(decrypted);
    return decrypted.toString(CryptoJS.enc.Utf8);
};





export const generateRSAKeyPair = () => {
    const keypair = forge.pki.rsa.generateKeyPair(2048);
    return {
        publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
        privateKey: forge.pki.privateKeyToPem(keypair.privateKey),
    };
};

export const encryptForUser = (message, userPublicKeyPem) => {
    const publicKey = forge.pki.publicKeyFromPem(userPublicKeyPem);
    const encrypted = publicKey.encrypt(message);
    return forge.util.encode64(encrypted);
};

export const decryptForUser = (ciphertextBase64, encryptedPrivateKey, password, salt) => {
    const decryptedPrivateKey = decryptPrivateKey(encryptedPrivateKey, password, salt);
    const privateKey = forge.pki.privateKeyFromPem(decryptedPrivateKey);
    const decrypted = privateKey.decrypt(forge.util.decode64(ciphertextBase64));
    // console.log(typeof decrypted);
    return decrypted;
};






export const SendMessage = async (receiver, receiverPublicKey, senderPublicKey, message, file = null) => {
    try {
        // console.log(receiverPublicKey);
        const aesKey = generateRandomAESKey();
        const encryptedMessage = encryptWithAES(message, aesKey);
        // console.log("message Encrypted With this", aesKey);
        const encryptedSenderkey = encryptForUser(aesKey, senderPublicKey);
        const encryptedReceiverKey = encryptForUser(aesKey, receiverPublicKey);
        // console.log(encryptedReceiverKey);
        //   console.log(message);
        const formData = new FormData();
        if (file) { formData.append('file', file); }
        else {
            formData.append('encryptedMessage', encryptedMessage);
            formData.append('encryptedSenderKey', encryptedSenderkey);
            formData.append('encryptedReceiverKey', encryptedReceiverKey);
        }
        //   formData.append("encryptedMessage")
        const res = await fetch(`/api/message/send/${receiver}`, {
            method: 'POST',
            headers: {
                'authtoken': JSON.stringify(localStorage.getItem('token')),
            },
            body: formData,
        });

        const data = await res.json();
        // Optionally update messages state with new message
        if (data.success) {
            return data.message;
        }

    } catch (err) {
        console.error("SendMessage error:", err);
    }
};


export const getSenderKey = async (groupId, user, privateKeyPem, password, salt) => {
    // console.log("user ", user, "groupId ", groupId);
    const response = await fetch(`/api/group/sender-keys/${groupId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const res = await response.json();
    // console.log(res);
    const senderKeyObj = res.find((entry) => entry.user === user);
    // console.log("senderkeyObj", senderKeyObj);
    if (!senderKeyObj) return null;
    return decryptForUser(senderKeyObj.encryptedSenderKey, privateKeyPem, password, salt);
};


// const testKey = generateRandomAESKey();
// const encrypted = encryptWithAES("Hello!", testKey);
// const decrypted = decryptWithAES(encrypted, testKey);
// console.log("Self test:", decrypted); // should log "Hello!"

// var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
// var decrypted = CryptoJS.AES.decrypt(encrypted.toString(), "Secret Passphrase");
// console.log(decrypted)